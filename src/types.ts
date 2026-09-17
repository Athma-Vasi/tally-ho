import type React from "react";
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

type ParcelFromWorkerToMain<
    Data = unknown,
> = {
    descendantId: string;
    dataResult: AppResult<Data>;
};

type SafeSuccess<Data = unknown> = Option<Data>;

type ValidationRegexes = Array<[RegExp, string]>;

type DescendantUpdatingForwardingAddress = {
    descendantId: string;
    descendantAction: string;
    descendantDispatch: React.Dispatch<any>;
};

export type {
    AppError,
    AppResult,
    DescendantUpdatingForwardingAddress,
    ParcelFromWorkerToMain,
    SafeSuccess,
    ValidationRegexes,
};
