import { fetch_timeout_ms } from "../../constants";
import { createWorkerMessageErrorMessageResult } from "../../errors";
import type { MessageResult } from "../../types";
import { createSuccessResult } from "../../utils";

type MessageEventLoggerWorkerToMain<Data = unknown> = MessageEvent<
  MessageResult<Data>
>;

type MessageEventMainToLoggerWorker = MessageEvent<
  MessageResult<{
    // url to fetch
    url: string;
    requestInit: RequestInit;
  }>
>;

self.onmessage = async (event: MessageEventMainToLoggerWorker) => {
  if (!event.data) {
    self.postMessage(
      createWorkerMessageErrorMessageResult(
        "No data received in logger worker message",
      ),
    );
    return;
  }

  const { abort } = new AbortController();
  const timeout = setTimeout(() => {
    abort();
  }, fetch_timeout_ms);

  try {
    // const { url, requestInit } = event.data;
    // const responseResult = await retryFetchSafe({
    //     input: url,
    //     init: requestInit,
    //     signal,
    // });

    // self.postMessage(responseResult);
    // clearTimeout(timeout);
    // return;

    self.postMessage(createSuccessResult("Logger worker received message"));
    clearTimeout(timeout);
    return;
  } catch (error: unknown) {
    self.postMessage(
      createWorkerMessageErrorMessageResult(
        error,
        "Error processing message in logger worker",
      ),
    );
  }
};

self.onerror = (event: string | Event) => {
  console.error("Unhandled error in cache worker:", event);
  self.postMessage(
    createWorkerMessageErrorMessageResult(
      event,
      "Unhandled error in cache worker",
    ),
  );
  return true; // Prevents default logging to console
};

export type { MessageEventLoggerWorkerToMain, MessageEventMainToLoggerWorker };
