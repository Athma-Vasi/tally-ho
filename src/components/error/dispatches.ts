import type { Option } from "ts-results-es";
import { type ErrorActions } from "./actions";

type SetChildComponentStateErrorDispatch = {
  action: ErrorActions["setChildComponentState"];
  payload: Record<string, unknown>;
};

type SetLoggerWorkerMaybeErrorDispatch = {
  action: ErrorActions["setLoggerWorkerMaybe"];
  payload: Option<Worker>;
};

type ErrorDispatch =
  | SetChildComponentStateErrorDispatch
  | SetLoggerWorkerMaybeErrorDispatch;

export type {
  ErrorDispatch,
  SetChildComponentStateErrorDispatch,
  SetLoggerWorkerMaybeErrorDispatch,
};
