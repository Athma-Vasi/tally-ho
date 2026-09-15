import localforage from "localforage";
import { Err, None, Ok, type Option, Some } from "ts-results-es";
import z from "zod";
import {
    AppErrorBase,
    CacheError,
    ParseError,
    PromiseAbortedError,
    UnknownError,
} from "./errors";
import type { AppResult } from "./types";

function capitalizeString(str: string): string {
    const trimmedStr = str.trim();
    return `${trimmedStr.charAt(0).toUpperCase()}${trimmedStr.slice(1)}`;
}

function createOptionSchema<Value extends any>(
    val: Value,
) {
    return z.object({
        none: z.boolean(),
        some: z.boolean(),
        val,
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
    parseDispatchAndSetState,
    parseSyncSafe,
    splitCamelCase,
};
