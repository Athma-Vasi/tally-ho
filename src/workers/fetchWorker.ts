import { None } from "ts-results-es";
import { fetch_timeout_ms } from "../constants";
import { createWorkerMessageHandlerErrorMessageResult } from "../errors";
import type { MessageResult } from "../types";
import {
  createOkMessageResult,
  postMessageResultFromWorkerToMainThread,
  retryFetchSafe,
} from "../utils";

type MessageFromFetchWorkerToMain<Message = unknown> = MessageResult<Message>;

type MessageFromMainToFetchWorker = {
  requestInit: RequestInit;
  url: URL | string;
};

type MessageEventFetchWorkerToMain<Message = unknown> = MessageEvent<
  MessageFromFetchWorkerToMain<Message>
>;

type MessageEventMainToFetchWorker = MessageEvent<MessageFromMainToFetchWorker>;

// block scope for persistent worker state
type FetchWorkerState = {
  queue: MessageEventMainToFetchWorker[];
  isProcessing: boolean;
};

{
  const state: FetchWorkerState = {
    queue: [],
    isProcessing: false,
  };

  async function processMessageEvent(
    event: MessageEventMainToFetchWorker,
  ): Promise<None> {
    if (!event.data) {
      console.error("No event data received in fetch worker");

      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          "No event data received in fetch worker",
        ),
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
      const { requestInit, url } = event.data;

      console.log("Fetching URL in fetch worker:", url);
      const responseResult = await retryFetchSafe({
        requestInit,
        signal,
        url,
      });

      if (responseResult.isErr()) {
        console.error(
          "Fetch worker encountered an error:",
          responseResult.error,
        );
        postMessageResultFromWorkerToMainThread({
          messageResult: createWorkerMessageHandlerErrorMessageResult(
            responseResult.error,
          ),
          self,
        });
        return None;
      }

      const responseMaybe = responseResult.value;
      console.log("Fetch worker received response result:", responseResult);
      if (responseMaybe.isNone()) {
        postMessageResultFromWorkerToMainThread({
          messageResult: createOkMessageResult(""),
          self,
        });
        return None;
      }

      console.log("Fetch worker received response:", responseMaybe.value);

      postMessageResultFromWorkerToMainThread({
        messageResult: createOkMessageResult(responseMaybe?.value ?? ""),
        self,
      });
      return None;
    } catch (error: unknown) {
      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          error,
          "Error processing message in fetch worker.",
        ),
        self,
      });
      return None;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function handleWorkerMessageEvent(
    event: MessageEventMainToFetchWorker,
  ): Promise<None> {
    console.group("Handling worker message event");
    console.log("Event data received:", event.data);
    console.groupEnd();

    state.queue.push(event);

    if (state.isProcessing) {
      console.log("Worker is already processing a message, queuing event.");
      return None;
    }

    state.isProcessing = true;

    try {
      while (state.queue.length > 0) {
        const currentEvent = state.queue.shift();

        console.log("Processing current event:", currentEvent);

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
          "Error processing message in fetch worker.",
        ),
        self,
      });
      return None;
    } finally {
      state.isProcessing = false;
    }
  }

  async function handleWorkerMessageError(
    event: string | Event,
  ): Promise<None> {
    console.error("Unhandled error in fetch worker:", event);

    postMessageResultFromWorkerToMainThread({
      messageResult: createWorkerMessageHandlerErrorMessageResult(
        event,
        "Unhandled error in fetch worker.",
      ),
      self,
    });
    return None;
  }

  async function handleWorkerPromiseRejection(
    event: PromiseRejectionEvent,
  ): Promise<None> {
    console.error("Unhandled promise rejection in fetch worker:", event.reason);

    postMessageResultFromWorkerToMainThread({
      messageResult: createWorkerMessageHandlerErrorMessageResult(
        event.reason,
        "Unhandled promise rejection in fetch worker.",
      ),
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
  MessageFromMainToFetchWorker,
  MessageFromFetchWorkerToMain,
};
