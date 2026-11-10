import type { Option, Result } from "ts-results-es";
import type { AppError } from "./errors";

type AppResult<Data = unknown> = Result<SafeSuccess<Data>, AppError>;

type SafeSuccess<Data = unknown> = Option<Data>;

type ValidationRegexes = Array<[RegExp, string]>;

/**
 * A plain, serializable envelope for crossing thread boundaries.
 * No methods, no prototype chain — safe for Structured Clone.
 */

type MessageOption<Value extends unknown = unknown> =
  | { hasValue: true; value: Value }
  | { hasValue: false; value?: never };

type MessageResult<
  Value extends unknown = unknown,
  Error extends AppError = AppError,
> =
  | { isOk: true; valueMaybe: MessageOption<Value>; error?: never }
  | { isOk: false; valueMaybe?: never; error: Error };

export type {
  AppResult,
  MessageOption,
  MessageResult,
  SafeSuccess,
  ValidationRegexes,
};
