import { None } from "ts-results-es";
import { async_timeout_ms } from "../constants";
import {
  createPromiseRejectionErrorTransportResult,
  createWorkerMessageHandlerErrorTransportResult,
} from "../errors";
import type { TransportResult } from "../types";
import {
  createOkTransportResult,
  createTransportResultFromAppResult,
  getCachedItemAbortableSafe,
  postMessageFromWorkerToMainThread,
  removeCachedItemAbortableSafe,
  setCachedItemAbortableSafe,
} from "../utils";

type MessageEventCacheWorkerToMain<Parcel = unknown> = MessageEvent<{
  descendantId: string;
  parcelResult: TransportResult<Parcel>;
}>;

type MessageEventMainToCacheWorker<
  Key = string,
  Value = unknown,
> = MessageEvent<
  | {
      descendantId: string;
      kind: "get";
      payload: [Key];
    }
  | {
      descendantId: string;
      kind: "set";
      payload: [Key, Value];
    }
  | {
      descendantId: string;
      kind: "remove";
      payload: [Key];
    }
>;

{
  // block scope for persistent worker state
  type CacheWorkerState = {
    queue: MessageEventMainToCacheWorker[];
    isProcessing: boolean;
  };

  const state: CacheWorkerState = {
    queue: [],
    isProcessing: false,
  };

  async function processMessageEvent(
    event: MessageEventMainToCacheWorker,
  ): Promise<None> {
    if (!event.data) {
      postMessageFromWorkerToMainThread({
        parcel: {
          descendantId: "",
          parcelResult: createWorkerMessageHandlerErrorTransportResult(
            "No data in message event.",
          ),
        },
        self,
      });
      return None;
    }

    const { abort, signal } = new AbortController();
    const timeout = setTimeout(() => {
      abort();
    }, async_timeout_ms);

    try {
      const { descendantId, kind, payload } = event.data;

      switch (kind) {
        case "get": {
          const [key] = payload;
          const getResult = await getCachedItemAbortableSafe<unknown>(
            key,
            signal,
          );

          postMessageFromWorkerToMainThread({
            parcel: {
              descendantId,
              parcelResult: createTransportResultFromAppResult(getResult),
            },
            self,
          });
          break;
        }

        case "set": {
          const [key, value] = payload;
          await setCachedItemAbortableSafe(key, value, signal);

          postMessageFromWorkerToMainThread({
            parcel: {
              descendantId,
              parcelResult: createOkTransportResult(""),
            },
            self,
          });
          break;
        }

        case "remove": {
          const [key] = payload;
          await removeCachedItemAbortableSafe(key, signal);

          postMessageFromWorkerToMainThread({
            parcel: {
              descendantId,
              parcelResult: createOkTransportResult(""),
            },
            self,
          });
          break;
        }

        default: {
          postMessageFromWorkerToMainThread({
            parcel: {
              descendantId,
              parcelResult: createWorkerMessageHandlerErrorTransportResult(
                `Unknown message kind: "${String(kind)}" received in cache worker`,
              ),
            },

            self,
          });
          break;
        }
      }

      return None;
    } catch (error: unknown) {
      postMessageFromWorkerToMainThread({
        parcel: {
          descendantId: "",
          parcelResult: createWorkerMessageHandlerErrorTransportResult(
            error,
            "Error processing message in cache worker.",
          ),
        },
        self,
      });
      return None;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function handleWorkerMessageEvent(
    event: MessageEventMainToCacheWorker,
  ): Promise<None> {
    state.queue.push(event);

    if (state.isProcessing) {
      return None;
    }

    state.isProcessing = true;

    try {
      while (state.queue.length > 0) {
        const currentEvent = state.queue.shift();

        if (!currentEvent) {
          continue;
        }

        await processMessageEvent(currentEvent);
      }

      return None;
    } catch (error: unknown) {
      postMessageFromWorkerToMainThread({
        parcel: {
          descendantId: "",
          parcelResult: createWorkerMessageHandlerErrorTransportResult(
            error,
            "Error processing message in cache worker.",
          ),
        },
        self,
      });
      return None;
    } finally {
      state.isProcessing = false;
    }
  }

  async function handleWorkerErrorEvent(event: string | Event): Promise<None> {
    console.error("Unhandled error in cache worker:", event);

    postMessageFromWorkerToMainThread({
      parcel: {
        descendantId: "",
        parcelResult: createWorkerMessageHandlerErrorTransportResult(
          event,
          "Unhandled error in cache worker.",
        ),
      },
      self,
    });
    return None;
  }

  async function handlePromiseRejectionEvent(
    event: PromiseRejectionEvent,
  ): Promise<None> {
    console.error("Unhandled promise rejection in cache worker:", event.reason);

    postMessageFromWorkerToMainThread({
      parcel: {
        descendantId: "",
        parcelResult: createPromiseRejectionErrorTransportResult(
          event?.reason ?? new Error("Unknown promise rejection"),
          "Unhandled promise rejection in cache worker.",
        ),
      },
      self,
    });

    return None;
  }

  self.onmessage = handleWorkerMessageEvent;
  self.onerror = handleWorkerErrorEvent;

  self.addEventListener("unhandledrejection", handlePromiseRejectionEvent);
}

export type { MessageEventCacheWorkerToMain, MessageEventMainToCacheWorker };
