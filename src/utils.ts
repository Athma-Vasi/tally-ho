import { Err, None, Ok, type Option, Some } from "ts-results-es";
import z from "zod";
import { AppErrorBase, ParseError, UnknownError } from "./errors";

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

function parseDispatchAndSetState<
    Payload extends z.ZodAny = z.ZodAny,
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

    if (parsedDispatchResult.err) {
        return state;
    }
    const parsedDispatchMaybe = parsedDispatchResult.safeUnwrap();
    if (parsedDispatchMaybe.none) {
        return state;
    }
    const parsedDispatch = parsedDispatchMaybe.safeUnwrap();

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

export { capitalizeString, createOptionSchema };
