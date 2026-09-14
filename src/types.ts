import type { Option, Result } from "ts-results-es";
import type { AppErrorBase } from "./errors";

type AppError = {
    name: string;
    errorKind: string;
    stack: string;
    message: string;
    status: Option<number>;
    timestamp: string;
};

type AppResult<Data = unknown> = Result<
    SafeSuccess<Data>,
    AppErrorBase
>;

type ResponseData = {
    body: string;
    id: number;
    title: string;
    userId: number;
};

type SafeSuccess<Data = unknown> = Option<Data>;

type ValidationRegexes = Array<[RegExp, string]>;

export type {
    AppError,
    AppResult,
    ResponseData,
    SafeSuccess,
    ValidationRegexes,
};
