import localforage from "localforage";
import { Err, None, Ok, Some, type Option } from "ts-results-es";
import {
  createAppError,
  createCacheErrorResult,
  createJSONError,
  createJSONErrorResult,
  createNetworkError,
  createNetworkErrorResult,
  createPromiseAbortedError,
  createPromiseAbortedErrorResult,
  createWorkerMessageErrorResult,
} from "./errors";
import type { AppResult, MessageResult } from "./types";
import type { MessageFromFetchWorkerToMain } from "./workers/fetchWorker";

function capitalizeString(str: string): string {
  const trimmedStr = str.trim();
  return `${trimmedStr.charAt(0).toUpperCase()}${trimmedStr.slice(1)}`;
}

function createSuccessResult<Data = unknown>(
  data: Data,
): Ok<Option<NonNullable<Data>>> {
  return new Ok(data == null ? None : Some(data));
}

async function getCachedItemAbortableSafe<Data = unknown>(
  key: string,
  signal: AbortSignal,
): Promise<AppResult<Data>> {
  if (signal.aborted) {
    return createPromiseAbortedErrorResult(
      "getCachedItemAbortableSafe aborted before start.",
    );
  }

  try {
    const cacheOperation = localforage.getItem<Data>(key);
    const data = await makeAbortable(cacheOperation, signal);
    return createSuccessResult(data);
  } catch (error: unknown) {
    return createCacheErrorResult(
      error,
      `Failed to get cached item for key: ${key}.`,
    );
  }
}

// Helper function to make any promise abortable
function makeAbortable<Data = unknown>(
  promise: Promise<Data>,
  signal: AbortSignal,
): Promise<Data> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      if (signal.aborted) {
        reject(
          createPromiseAbortedError(
            "Promise was aborted before it could complete.",
          ),
        );
      }

      signal.addEventListener("abort", () => {
        reject(
          createPromiseAbortedError(
            "Promise was aborted before it could complete.",
          ),
        );
      });
    }),
  ]);
}

function postMessageResultFromWorkerToMainThread<
  MessageResult extends MessageFromFetchWorkerToMain,
>({
  messageResult,
  self,
}: {
  messageResult: MessageResult;
  self: Window & typeof globalThis;
}): None {
  self.postMessage(messageResult);
  return None;
}

async function removeCachedItemAbortableSafe(
  key: string,
  signal: AbortSignal,
): Promise<AppResult> {
  if (signal.aborted) {
    return createPromiseAbortedErrorResult(
      "removeCachedItemAbortableSafe aborted before start.",
    );
  }

  try {
    const cacheOperation = localforage.removeItem(key);
    await makeAbortable(cacheOperation, signal);
    return new Ok(None);
  } catch (error: unknown) {
    return createCacheErrorResult(
      error,
      `Failed to remove cached item for key: ${key}.`,
    );
  }
}

type RetryFetchOptions = {
  backOffFactor?: number;
  retries?: number;
  delayMs?: number;
};
async function retryFetchSafe<Data = unknown>({
  requestInit,
  retryOptions,
  signal,
  url,
}: {
  requestInit: RequestInit;
  retryOptions?: RetryFetchOptions;
  signal: AbortSignal | undefined;
  url: RequestInfo | URL;
}): Promise<AppResult<Data>> {
  const { backOffFactor = 2, retries = 3, delayMs = 1000 } = retryOptions ?? {};

  async function tryAgain(attempt: number): Promise<AppResult<Data>> {
    try {
      const response: Response = await fetch(url, {
        ...requestInit,
        signal,
      });
      if (response == null) {
        // perhaps a network-level failure occurred before any HTTP response could be received
        // trigger a retry
        throw createNetworkError("Response is null or undefined.");
      }

      try {
        const data = await response.json();
        if (data == null) {
          // trigger a retry
          throw createJSONError("Response data is null or undefined.");
        }

        console.log("Fetch successful, received data:", data);

        return Promise.resolve(createSuccessResult<Data>(data as Data));
      } catch (error_: unknown) {
        if (attempt === retries) {
          return Promise.resolve(
            createJSONErrorResult(
              error_,
              "Failed to parse JSON response after maximum retries.",
            ),
          );
        }

        throw createJSONError(error_);
      }
    } catch (error: unknown) {
      console.error(`Attempt ${attempt} failed with error:`, error);

      if (attempt === retries) {
        return Promise.resolve(
          createNetworkErrorResult(error, 503, "Max retries reached."),
        );
      }

      // Exponential backoff with jitter
      const backOff = Math.pow(backOffFactor, attempt) * delayMs;
      const jitter = backOff * 0.2 * (Math.random() - 0.5);
      const delay = backOff + jitter;

      console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);

      return new Promise((resolve) => {
        setTimeout(() => {
          tryAgain(attempt + 1).then(resolve);
        }, delay);
      });
    }
  }

  return tryAgain(0);
}

function sendMessageToWorker<
  MsgEvent extends MessageEvent = MessageEvent,
  Actions extends Record<string, string> & {
    setAppErrorResultMaybe: "setAppErrorResultMaybe";
  } = Record<string, string> & {
    setAppErrorResultMaybe: "setAppErrorResultMaybe";
  },
>({
  actions,
  dispatch,
  message,
  workerMaybe,
}: {
  actions: Actions;
  dispatch: React.ActionDispatch<[dispatch: any]>;
  message: MsgEvent["data"];
  workerMaybe: Option<Worker>;
}): None {
  try {
    if (workerMaybe.isNone()) {
      console.error("Worker is not initialized for message:", message);

      dispatch({
        action: actions.setAppErrorResultMaybe,
        payload: Some(
          createNetworkErrorResult(
            `Worker is not initialized for message: ${String(message)}.`,
            404,
          ),
        ),
      });

      return None;
    }

    console.log("Sending message to worker:", message);
    console.log("Worker maybe:", workerMaybe);

    const worker = workerMaybe.value;
    worker.postMessage(message);
    return None;
  } catch (error) {
    console.error("Failed to post message to worker:", error);

    dispatch({
      action: actions.setAppErrorResultMaybe,
      payload: Some(
        createWorkerMessageErrorResult(
          error,
          `Failed to post message: ${String(message)} to worker.`,
        ),
      ),
    });
    return None;
  }
}

async function setCachedItemAbortableSafe<Data = unknown>(
  key: string,
  value: Data,
  signal: AbortSignal,
): Promise<AppResult> {
  if (signal.aborted) {
    return createPromiseAbortedErrorResult(
      "setCachedItemAbortableSafe aborted before start.",
    );
  }

  try {
    const cacheOperation = localforage.setItem<Data>(key, value);
    await makeAbortable(cacheOperation, signal);
    return new Ok(None);
  } catch (error: unknown) {
    return createCacheErrorResult(
      error,
      `Failed to set cached item for key: ${key}`,
    );
  }
}

function splitCamelCase(word: string): string {
  // Replace lowercase-uppercase pairs with a space in between
  const splitStr = word.replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize the first letter of the resulting string
  return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
}

function createOkMessageResult<Data extends unknown = unknown>(
  data: Data,
): MessageResult<Data> {
  return {
    isOk: true,
    valueMaybe:
      data == null ? { hasValue: false } : { hasValue: true, value: data },
  };
}

function createMessageResultFromAppResult<Value extends unknown = unknown>(
  appResult: AppResult<Value>,
): MessageResult<Value> {
  if (appResult === null) {
    return { isOk: false, error: createAppError("App result is null.") };
  }

  if (appResult === undefined) {
    return { isOk: false, error: createAppError("App result is undefined.") };
  }

  if (appResult.isErr()) {
    return { isOk: false, error: appResult.error };
  }

  const appOption = appResult.value;

  if (appOption.isNone()) {
    return {
      isOk: true,
      valueMaybe: {
        hasValue: false,
      },
    };
  }

  const value = appOption.unwrap();

  if (value == null) {
    return {
      isOk: true,
      valueMaybe: {
        hasValue: false,
      },
    };
  }

  return {
    isOk: true,
    valueMaybe: {
      hasValue: true,
      value,
    },
  };
}

function createOkAppResult(value?: unknown): AppResult {
  return new Ok(value == null ? None : Some(value));
}

function createAppResultFromMessageResult<Value extends unknown = unknown>(
  messageResult: MessageResult<Value>,
): AppResult<Value> {
  if (messageResult === null) {
    return new Err(createAppError("Message result is null."));
  }

  if (messageResult === undefined) {
    return new Err(createAppError("Message result is undefined."));
  }

  if (!messageResult.isOk) {
    return new Err(messageResult.error);
  }

  const {
    valueMaybe: { hasValue, value },
  } = messageResult;

  if (!hasValue) {
    return new Ok(None);
  }

  // If the transport result value is an empty string, treat it as None
  // if (typeof value === "string" && value.length === 0) {
  //   return new Ok(None);
  // }

  return new Ok(Some(value));
}

export {
  capitalizeString,
  createAppResultFromMessageResult,
  createMessageResultFromAppResult,
  createOkAppResult,
  createOkMessageResult,
  createSuccessResult,
  getCachedItemAbortableSafe,
  postMessageResultFromWorkerToMainThread,
  removeCachedItemAbortableSafe,
  retryFetchSafe,
  sendMessageToWorker,
  setCachedItemAbortableSafe,
  splitCamelCase,
};
export type { RetryFetchOptions };
