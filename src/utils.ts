import localforage from "localforage";
import { Err, None, Ok, type Option, Some } from "ts-results-es";
import z from "zod";
import {
    AppErrorBase,
    CacheError,
    JSONError,
    NetworkError,
    NotFoundError,
    ParseError,
    PromiseAbortedError,
    UnknownError,
    WorkerMessageError,
} from "./errors";
import type { AppResult } from "./types";

function capitalizeString(str: string): string {
    const trimmedStr = str.trim();
    return `${trimmedStr.charAt(0).toUpperCase()}${trimmedStr.slice(1)}`;
}

function createOptionSchema<Value extends any>(
    value: Value,
    value: Value,
) {
    return z.object({
        none: z.boolean(),
        some: z.boolean(),
        value,
        value,
    });
}

function createSuccessResult<Data = unknown>(
    data: Data,
): Ok<Option<NonNullable<Data>>> {
    return new Ok(data == null ? None : Some(data));
}

function createErrorResult(
    appErrorBase: AppErrorBase,
): Err<AppErrorBase> {
    if (appErrorBase instanceof AppErrorBase) {
        return new Err(appErrorBase);
    }

    return new Err(
        new UnknownError(
            appErrorBase,
            "createErrorResult received non-AppErrorBase instance",
        ),
    );
}

async function getCachedItemAbortableSafe<Data = unknown>(
    key: string,
    signal: AbortSignal,
): Promise<AppResult<Data>> {
    if (signal.aborted) {
        return createErrorResult(
            new PromiseAbortedError(
                "getCachedItemAbortableSafe aborted before start",
            ),
        );
    }

    try {
        const cacheOperation = localforage.getItem<Data>(key);
        const data = await makeAbortable(cacheOperation, signal);
        return createSuccessResult(data);
    } catch (error: unknown) {
        return createErrorResult(
            new CacheError(error, `Failed to get cached item for key: ${key}`),
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
                    new PromiseAbortedError(
                        "Promise was aborted before it could complete",
                    ),
                );
            }

            signal.addEventListener("abort", () => {
                reject(
                    new PromiseAbortedError(
                        "Promise was aborted before it could complete",
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
>(
    { dispatch, key, state, schema }: {
        dispatch: Dispatch;
        schema: z.ZodObject<
            {
                action: z.ZodLiteral<string>;
                payload: Payload;
            }
        >;
        state: State;
        key: keyof State;
    },
): State {
    const parsedDispatchResult = parseSyncSafe(
        {
            object: dispatch,
            schema,
        },
    );

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

function parseSyncSafe<Output = unknown>(
    { object, schema }: {
        object: Output;
        schema: z.ZodType;
    },
): AppResult<Output> {
    try {
        const { data, error, success } = Array.isArray(object)
            ? z.array(schema).safeParse(object)
            : schema.safeParse(object);

        return success
            ? createSuccessResult(data as Output)
            : createErrorResult(
                new ParseError(
                    `Failed to parse object: ${error.message}`,
                ),
            );
    } catch (error_: unknown) {
        return createErrorResult(
            new ParseError(
                error_,
                `Exception thrown during parse of object:
                ${JSON.stringify(object, null, 2) ?? "unknown object"}`,
            ),
        );
    }
}

async function removeCachedItemAbortableSafe(
    key: string,
    signal: AbortSignal,
): Promise<AppResult> {
    if (signal.aborted) {
        return createErrorResult(
            new PromiseAbortedError(
                "removeCachedItemAbortableSafe aborted before start",
            ),
        );
    }

    try {
        const cacheOperation = localforage.removeItem(key);
        await makeAbortable(cacheOperation, signal);
        return new Ok(None);
    } catch (error: unknown) {
        return createErrorResult(
            new CacheError(
                error,
                `Failed to remove cached item for key: ${key}`,
            ),
        );
    }
}

type RetryFetchOptions = {
    backOffFactor?: number;
    retries?: number;
    delayMs?: number;
};
async function retryFetchSafe<
    Data = unknown,
>(
    { requestInit, retryOptions, signal, url }: {
        requestInit: RequestInit;
        retryOptions?: RetryFetchOptions;
        signal: AbortSignal | undefined;
        url: RequestInfo | URL;
    },
): Promise<AppResult<Data>> {
    const {
        backOffFactor = 2,
        retries = 3,
        delayMs = 1000,
    } = retryOptions ?? {};

    async function tryAgain(
        attempt: number,
    ): Promise<AppResult<Data>> {
        try {
            const response: Response = await fetch(url, {
                ...requestInit,
                signal,
            });
            if (response == null) {
                // perhaps a network-level failure occurred before any HTTP response could be received
                // trigger a retry
                throw new NetworkError("Response is null or undefined");
            }

            try {
                const data = await response.json();
                if (data == null) {
                    // trigger a retry
                    throw new JSONError("Response data is null or undefined");
                }

                return Promise.resolve(
                    createSuccessResult<Data>(
                        data as Data,
                    ),
                );
            } catch (error_: unknown) {
                if (attempt === retries) {
                    return Promise.resolve(
                        createErrorResult(
                            new JSONError(
                                error_,
                                "Failed to parse JSON response after maximum retries",
                            ),
                        ),
                    );
                }

                throw new JSONError(error_);
            }
        } catch (error: unknown) {
            if (attempt === retries) {
                return Promise.resolve(
                    createErrorResult(
                        new NetworkError(error, 503, "Max retries reached"),
                    ),
                );
            }

            // Exponential backoff with jitter
            const backOff = Math.pow(backOffFactor, attempt) * delayMs;
            const jitter = backOff * 0.2 * (Math.random() - 0.5);
            const delay = backOff + jitter;

            console.log(
                `Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`,
            );

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
    } =
        & Record<string, string>
        & { setSafeErrorMaybe: "setSafeErrorMaybe" },
>(
    { actions, dispatch, message, workerMaybe }: {
        actions: Actions;
        dispatch: React.ActionDispatch<[dispatch: any]>;
        message: MsgEvent["data"];
        workerMaybe: Option<Worker>;
    },
): None {
    try {
        if (workerMaybe.isNone()) {
            dispatch({
                action: actions.setSafeErrorMaybe,
                payload: Some(
                    createErrorResult(
                        new NotFoundError(
                            `Worker is not initialized for message: ${
                                String(message)
                            }`,
                        ),
                    ),
                ),
            });

            return None;
        }

        const worker = workerMaybe.value;
        worker.postMessage(message);
        return None;
    } catch (error) {
        dispatch({
            action: actions.setSafeErrorMaybe,
            payload: Some(
                createErrorResult(
                    new WorkerMessageError(
                        error,
                        `Failed to post message: ${String(message)} to worker`,
                    ),
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
        return createErrorResult(
            new PromiseAbortedError(
                "setCachedItemAbortableSafe aborted before start",
            ),
        );
    }

    try {
        const cacheOperation = localforage.setItem<Data>(key, value);
        await makeAbortable(cacheOperation, signal);
        return new Ok(None);
    } catch (error: unknown) {
        return createErrorResult(
            new CacheError(error, `Failed to set cached item for key: ${key}`),
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

export {
    capitalizeString,
    createErrorResult,
    createOptionSchema,
    createSuccessResult,
    getCachedItemAbortableSafe,
    getCachedItemAbortableSafe,
    parseDispatchAndSetState,
    parseSyncSafe,
    removeCachedItemAbortableSafe,
    removeCachedItemAbortableSafe,
    retryFetchSafe,
    retryFetchSafe,
    sendMessageToWorker,
    sendMessageToWorker,
    setCachedItemAbortableSafe,
    setCachedItemAbortableSafe,
    splitCamelCase,
};
export type { RetryFetchOptions, RetryFetchOptions };
