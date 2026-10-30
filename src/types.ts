import type React from "react";
import type { Option, Result } from "ts-results-es";
import type { AppError } from "./errors";

type AppResult<Data = unknown> = Result<SafeSuccess<Data>, AppError>;

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
type TransportResult<Value extends unknown = unknown, Error extends AppError = AppError> =
  | { isOk: true; value: Value; error?: never }
  | { isOk: false; value?: never; error: Error };
// { isError: boolean; error: Error; isNone?: boolean; value?: Value };
// { ok: true; value: Value } | { ok: false; value: " " };

type TransportOption<Value extends unknown = unknown> =
  | { hasValue: true; value: Value }
  | { hasValue: false; value?: never };

export type {
  AppResult,
  DescendantUpdatingForwardingAddress,
  SafeSuccess,
  TransportOption,
  TransportResult,
  ValidationRegexes,
};
