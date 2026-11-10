import { None } from "ts-results-es";
import { createWorkerMessageHandlerErrorMessageResult } from "../errors";
import type { MessageResult } from "../types";
import { postMessageResultFromWorkerToMainThread } from "../utils";

type MessageEventLoggerWorkerToMain<Data = unknown> = MessageEvent<
  MessageResult<Data>
>;

type MessageFromMainToLoggerWorker = {
  requestInit: RequestInit;
  url: URL | string;
};

type MessageEventMainToLoggerWorker =
  MessageEvent<MessageFromMainToLoggerWorker>;

type LoggerWorkerState = {
  queue: MessageEventMainToLoggerWorker[];
  isProcessing: boolean;
};

{
  const state: LoggerWorkerState = {
    queue: [],
    isProcessing: false,
  };

  async function processMessageEvent(
    event: MessageEventMainToLoggerWorker,
  ): Promise<None> {
    if (!event.data) {
      console.error("No event data received in logger worker");

      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          "No event data received in logger worker",
        ),
        self,
      });
      return None;
    }

    console.log("Received event in logger worker:", event);

    try {
      // postMessageResultFromWorkerToMainThread({
      //   messageResult: createOkMessageResult("Logger worker received message"),
      //   self,
      // });
      return None;
    } catch (error: unknown) {
      postMessageResultFromWorkerToMainThread({
        messageResult: createWorkerMessageHandlerErrorMessageResult(
          error,
          "Error processing message in logger worker.",
        ),
        self,
      });
      return None;
    }
  }

  async function handleWorkerMessageEvent(
    event: MessageEventMainToLoggerWorker,
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
          "Error processing message in logger worker.",
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
    console.error("Error in logger worker:", event);

    postMessageResultFromWorkerToMainThread({
      messageResult: createWorkerMessageHandlerErrorMessageResult(
        event,
        "Error in logger worker.",
      ),
      self,
    });
    return None;
  }

  async function handleWorkerPromiseRejection(
    event: PromiseRejectionEvent,
  ): Promise<None> {
    console.error(
      "Unhandled promise rejection in logger worker:",
      event.reason,
    );

    postMessageResultFromWorkerToMainThread({
      messageResult: createWorkerMessageHandlerErrorMessageResult(
        event.reason,
        "Unhandled promise rejection in logger worker.",
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
  MessageEventLoggerWorkerToMain,
  MessageEventMainToLoggerWorker,
  MessageFromMainToLoggerWorker,
};
