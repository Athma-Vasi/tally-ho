import { None } from "ts-results-es";
import { fetch_timeout_ms } from "../../constants";
import { PromiseRejectionError, WorkerError, WorkerMessageError } from "../../errors";
import type { TransportResult } from "../../types";
import {
  createErrorResult,
  createSuccessResult,
  postMessageToMainThread,
  retryFetchSafe,
} from "../../utils";

type ParcelFromFetchWorkerToMain<Parcel = unknown> = {
  descendantId: string;
  parcelResult: TransportResult<Parcel>;
};

type OrderFromMainToFetchWorker = {
  descendantId: string;
  requestInit: RequestInit;
  url: URL | string;
};

type MessageEventFetchWorkerToMain<Data = unknown> = MessageEvent<
  ParcelFromFetchWorkerToMain<Data>
>;

type MessageEventMainToFetchWorker = MessageEvent<OrderFromMainToFetchWorker>;

{
  // block scope for persistent worker state
  type FetchWorkerState = {
    queue: MessageEventMainToFetchWorker[];
    isProcessing: boolean;
  };

  const state: FetchWorkerState = {
    queue: [],
    isProcessing: false,
  };

  async function processMessageEvent(event: MessageEventMainToFetchWorker): Promise<None> {
    if (!event.data) {
      postMessageToMainThread({
        message: {
          descendantId: "",
          dataResult: createErrorResult(
            new WorkerMessageError("No data received in fetch worker message"),
          ),
        },
        self,
      });
      return None;
    }

    console.log("Received event in fetch worker:", event);

    const { abort, signal } = new AbortController();
    const timeout = setTimeout(() => {
      abort();
    }, fetch_timeout_ms);

    try {
      const { descendantId, requestInit, url } = event.data;

      console.log("Fetching URL in fetch worker:", url);
      const responseResult = await retryFetchSafe({
        requestInit,
        signal,
        url,
      });

      if (responseResult.isErr()) {
        console.error("Fetch worker encountered an error:", responseResult.error);
        postMessageToMainThread({
          message: {
            descendantId,
            dataResult: responseResult,
          },
          self,
        });
        return None;
      }

      const responseMaybe = responseResult.value;
      console.log("Fetch worker received response result:", responseResult);
      if (responseMaybe.isNone()) {
        postMessageToMainThread({
          message: {
            descendantId,
            dataResult: createErrorResult(new WorkerMessageError("Fetch worker returned None")),
          },
          self,
        });
        return None;
      }

      console.log("Fetch worker received response:", responseMaybe.value);

      postMessageToMainThread({
        message: {
          descendantId,
          dataResult: createSuccessResult(responseMaybe.value),
        },
        self,
      });
      return None;
    } catch (error: unknown) {
      postMessageToMainThread({
        message: {
          descendantId: "",
          dataResult: createErrorResult(new WorkerError(error)),
        },
        self,
      });
      return None;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function handleWorkerMessageEvent(event: MessageEventMainToFetchWorker): Promise<None> {
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
      postMessageToMainThread({
        message: {
          descendantId: "",
          dataResult: createErrorResult(new WorkerError(error)),
        },
        self,
      });
      return None;
    } finally {
      state.isProcessing = false;
    }
  }

  async function handleWorkerMessageError(event: string | Event): Promise<None> {
    console.error("Unhandled error in fetch worker:", event);

    postMessageToMainThread({
      message: {
        descendantId: "",
        dataResult: createErrorResult(new WorkerError(event, "Unhandled error in fetch worker")),
      },
      self,
    });
    return None;
  }

  async function handleWorkerPromiseRejection(event: PromiseRejectionEvent): Promise<None> {
    console.error("Unhandled promise rejection in fetch worker:", event.reason);

    postMessageToMainThread({
      message: {
        descendantId: "",
        dataResult: createErrorResult(
          new PromiseRejectionError(event.reason, "Unhandled promise rejection in fetch worker"),
        ),
      },
      self,
    });
    return None;
  }

  self.onmessage = handleWorkerMessageEvent;
  self.onerror = handleWorkerMessageError;

  self.addEventListener("unhandledrejection", handleWorkerPromiseRejection);
}

export type {
  MessageEventFetchWorkerToMain,
  MessageEventMainToFetchWorker,
  OrderFromMainToFetchWorker,
  ParcelFromFetchWorkerToMain,
};
