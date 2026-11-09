import type { Option } from "ts-results-es";
import { type GlobalActions } from "./actions";
import type { AppErrorResult } from "../../errors";

type SetAppErrorResultMaybeDispatch = {
  action: GlobalActions["setAppErrorResultMaybe"];
  payload: Option<AppErrorResult>;
};

type GlobalDispatch = SetAppErrorResultMaybeDispatch;

export type { GlobalDispatch, SetAppErrorResultMaybeDispatch };
