import type { Option } from "ts-results-es";

type AppError = {
    name: string;
    errorKind: string;
    stack: string;
    message: string;
    status: Option<number>;
    timestamp: string;
};

type ResponseData = {
    body: string;
    id: number;
    title: string;
    userId: number;
};

type ValidationRegexes = Array<[RegExp, string]>;

export type { AppError, ResponseData, ValidationRegexes };
