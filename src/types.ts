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

type AppResult<Data = unknown> = Result<SafeSuccess<Data>, AppErrorBase>;

type ParcelFromWorkerToMain<Data = unknown> = {
  descendantId: string;
  transportResult: TransportResult<Data>;
};

type OrderFromMainToWorker<Data = unknown> = {
  descendantId: string;
  transportResult: TransportResult<Data>;
};

type SafeSuccess<Data = unknown> = Option<Data>;

type ValidationRegexes = Array<[RegExp, string]>;

type DescendantUpdatingForwardingAddress = {
  descendantId: string;
  descendantAction: string;
  descendantDispatch: React.Dispatch<any>;
};

/**
 * A plain, serializable envelope for crossing thread boundaries.
 * No methods, no prototype chain — safe for Structured Clone.
 */
type TransportResult<Value, Error = string> =
  | { ok: true; value: Value; error?: never }
  | { ok: false; value?: never; error: Error };

type TransportOption<Value> = { hasValue: true; value: Value } | { hasValue: false; value?: never };

export type {
  AppError,
  AppResult,
  DescendantUpdatingForwardingAddress,
  ParcelFromWorkerToMain,
  SafeSuccess,
  TransportOption,
  TransportResult,
  ValidationRegexes,
};
