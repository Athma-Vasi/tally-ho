import type React from "react";
import type { Option, Result } from "ts-results-es";
import type { AppErrorBase, TransportErrorStrings } from "./errors";

type AppError = {
  name: string;
  errorKind: string;
  stack: string;
  message: string;
  status: Option<number>;
  timestamp: string;
};

type AppResult<Data = unknown> = Result<SafeSuccess<Data>, AppErrorBase>;

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
type TransportResult<Value, Error = TransportErrorStrings> =
  // | { ok: true; value: Value; error?: never }
  // | { ok: false; value?: never; error: Error };
  // { isError: boolean; error: Error; isNone?: boolean; value?: Value };
  { ok: true; value: Value } | { ok: false; value: " " };

type TransportOption<Value> = { hasValue: true; value: Value } | { hasValue: false; value?: never };

export type {
  AppError,
  AppResult,
  DescendantUpdatingForwardingAddress,
  SafeSuccess,
  TransportOption,
  TransportResult,
  ValidationRegexes,
};
