import { None } from "ts-results-es";
import { async_timeout_ms } from "../constants";
import {
  createPromiseRejectionErrorMessageResult,
  createWorkerMessageHandlerErrorMessageResult,
} from "../errors";
import type { MessageResult } from "../types";
import {
  createMessageResultFromAppResult,
  createOkMessageResult,
  getCachedItemAbortableSafe,
  postMessageResultFromWorkerToMainThread,
  removeCachedItemAbortableSafe,
  setCachedItemAbortableSafe,
} from "../utils";

type MessageEventCacheWorkerToMain<Message = unknown> = MessageEvent<
  MessageResult<Message>
>;

type MessageEventMainToCacheWorker<
  Key = string,
  Value = unknown,
> = MessageEvent<
  | {
      kind: "get";
      payload: [Key];
    }
  | {
      kind: "set";
      payload: [Key, Value];
    }
  | {
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
      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          "No data in message event.",
        ),
        self,
      });
      return None;
    }

    const { abort, signal } = new AbortController();
    const timeout = setTimeout(() => {
      abort();
    }, async_timeout_ms);

    try {
      const { kind, payload } = event.data;

      switch (kind) {
        case "get": {
          const [key] = payload;
          const getResult = await getCachedItemAbortableSafe<unknown>(
            key,
            signal,
          );

          postMessageResultFromWorkerToMainThread({
            messageResult: createMessageResultFromAppResult(getResult),
            self,
          });
          break;
        }

        case "set": {
          const [key, value] = payload;
          await setCachedItemAbortableSafe(key, value, signal);

          postMessageResultFromWorkerToMainThread({
            messageResult: createOkMessageResult(""),
            self,
          });
          break;
        }

        case "remove": {
          const [key] = payload;
          await removeCachedItemAbortableSafe(key, signal);

          postMessageResultFromWorkerToMainThread({
            messageResult: createOkMessageResult(""),
            self,
          });
          break;
        }

        default: {
          postMessageResultFromWorkerToMainThread({
            messageResult: createWorkerMessageHandlerErrorMessageResult(
              `Unknown message kind: "${String(kind)}" received in cache worker`,
            ),
            self,
          });
          break;
        }
      }

      return None;
    } catch (error: unknown) {
      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          error,
          "Error processing message in cache worker.",
        ),
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
      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          error,
          "Error processing message in cache worker.",
        ),
        self,
      });
      return None;
    } finally {
      state.isProcessing = false;
    }
  }

  async function handleWorkerErrorEvent(event: string | Event): Promise<None> {
    console.error("Error in cache worker:", event);

    postMessageResultFromWorkerToMainThread({
      messageResult: createWorkerMessageHandlerErrorMessageResult(
        event,
        "Error in cache worker.",
      ),
      self,
    });
    return None;
  }

  async function handlePromiseRejectionEvent(
    event: PromiseRejectionEvent,
  ): Promise<None> {
    console.error("Unhandled promise rejection in cache worker:", event.reason);

    postMessageResultFromWorkerToMainThread({
      messageResult: createPromiseRejectionErrorMessageResult(
        event?.reason ?? new Error("Unknown promise rejection"),
        "Unhandled promise rejection in cache worker.",
      ),
      self,
    });

    return None;
  }

  self.onmessage = handleWorkerMessageEvent;
  self.onerror = handleWorkerErrorEvent;

  self.addEventListener("unhandledrejection", handlePromiseRejectionEvent);
}

export type { MessageEventCacheWorkerToMain, MessageEventMainToCacheWorker };
