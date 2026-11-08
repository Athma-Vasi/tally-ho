import localforage from "localforage";
import { Err, None, Ok, Some, type Option } from "ts-results-es";
import z from "zod";
import {
  createAppError,
  createCacheErrorResult,
  createJSONError,
  createJSONErrorResult,
  createNetworkError,
  createNetworkErrorResult,
  createParseErrorResult,
  createPromiseAbortedError,
  createPromiseAbortedErrorResult,
  createWorkerMessageErrorResult,
} from "./errors";
import type { AppResult, TransportResult } from "./types";
import type { ParcelFromFetchWorkerToMain } from "./workers/fetchWorker";

function capitalizeString(str: string): string {
  const trimmedStr = str.trim();
  return `${trimmedStr.charAt(0).toUpperCase()}${trimmedStr.slice(1)}`;
}

function createOptionSchema<Value extends any>(value: Value) {
  return z.object({
    isNone: z.function(),
    isSome: z.function(),
    value,
  });
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

function parseDispatchAndSetState<
  Payload extends
    | z.ZodString
    | z.ZodBoolean
    | z.ZodNumber
    | z.ZodArray
    | z.ZodEnum
    | z.ZodMap
    | z.ZodNullable<z.ZodCustom<Worker, Worker>>
    | z.ZodCustom<Worker, Worker>
    | z.ZodCustom<FormData, FormData>
    | z.ZodNullable<z.ZodCustom<Err<unknown>, Err<unknown>>>
    | z.ZodRecord<z.ZodString, z.ZodUnknown>
    | z.ZodObject = any,
  Dispatch extends { action: string; payload: unknown } = {
    action: string;
    payload: unknown;
  },
  State extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
>({
  dispatch,
  key,
  state,
  schema,
}: {
  dispatch: Dispatch;
  schema: z.ZodObject<{
    action: z.ZodLiteral<string>;
    payload: Payload;
  }>;
  state: State;
  key: keyof State;
}): State {
  const parsedDispatchResult = parseSyncSafe({
    object: dispatch,
    schema,
  });

  if (parsedDispatchResult.isErr()) {
    return state;
  }
  const parsedDispatchMaybe = parsedDispatchResult.unwrap();
  if (parsedDispatchMaybe.isNone()) {
    return state;
  }
  const parsedDispatch = parsedDispatchMaybe.unwrap();

  return {
    ...state,
    [key]: parsedDispatch.payload as State[typeof key],
  };
}

function parseSyncSafe<Output = unknown>({
  object,
  schema,
}: {
  object: Output;
  schema: z.ZodType;
}): AppResult<Output> {
  try {
    const { data, error, success } = Array.isArray(object)
      ? z.array(schema).safeParse(object)
      : schema.safeParse(object);

    return success
      ? createSuccessResult(data as Output)
      : createParseErrorResult(
          error,
          `Failed to parse object: ${error?.message ?? "Error message was null or undefined."}`,
        );
  } catch (error_: unknown) {
    return createParseErrorResult(
      error_,
      `Exception thrown during parse of object:
              ${String(object)}.`,
    );
  }
}

function postMessageFromWorkerToMainThread<
  Parcel extends ParcelFromFetchWorkerToMain,
>({
  parcel,
  self,
}: {
  parcel: Parcel;
  self: Window & typeof globalThis;
}): None {
  self.postMessage(parcel);
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
    setSafeErrorMaybe: "setSafeErrorMaybe";
  } = Record<string, string> & { setSafeErrorMaybe: "setSafeErrorMaybe" },
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
        action: actions.setSafeErrorMaybe,
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
      action: actions.setSafeErrorMaybe,
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
  const result = parseSyncSafe({
    object: word,
    schema: z.string(),
  });
  if (result.isErr() || result.value.isNone()) {
    return "";
  }
  // Replace lowercase-uppercase pairs with a space in between
  const splitStr = result.value.unwrap().replace(/([a-z])([A-Z])/g, "$1 $2");
  // Capitalize the first letter of the resulting string
  return splitStr.charAt(0).toUpperCase() + splitStr.slice(1);
}

function createOkTransportResult<Data extends unknown = unknown>(
  data: Data,
): TransportResult<Data> {
  return {
    isOk: true,
    value: data,
  };
}

function createTransportResultFromAppResult<Value extends unknown = unknown>(
  appResult: AppResult<Value>,
): TransportResult<Value> {
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

  // ! At the boundary between the worker reality and main thread reality,
  // the non-existence of a value is represented as an empty string for transport purposes
  // An empty string, in this app, represents a non-existent value (None)
  if (appOption.isNone()) {
    return { isOk: true, value: "" as Value };
  }

  return { isOk: true, value: appOption.unwrap() };
}

function createAppResultFromTransportResult<Value extends unknown = unknown>(
  transportResult: TransportResult<Value>,
): AppResult<Value> {
  if (transportResult === null) {
    return new Err(createAppError("Transport result is null."));
  }

  if (transportResult === undefined) {
    return new Err(createAppError("Transport result is undefined."));
  }

  if (!transportResult.isOk) {
    return new Err(transportResult.error);
  }

  // If the transport result value is an empty string, treat it as None
  if (
    typeof transportResult.value === "string" &&
    transportResult.value.length === 0
  ) {
    return new Ok(None);
  }

  return new Ok(Some(transportResult.value));
}

export {
  capitalizeString,
  createAppResultFromTransportResult,
  createOkTransportResult,
  createOptionSchema,
  createSuccessResult,
  createTransportResultFromAppResult,
  getCachedItemAbortableSafe,
  parseDispatchAndSetState,
  parseSyncSafe,
  postMessageFromWorkerToMainThread,
  removeCachedItemAbortableSafe,
  retryFetchSafe,
  sendMessageToWorker,
  setCachedItemAbortableSafe,
  splitCamelCase,
};
export type { RetryFetchOptions };
