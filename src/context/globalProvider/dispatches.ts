import { type GlobalActions } from "./actions";

type SetAppErrorResultMaybeDispatch = {
  action: GlobalActions["setAppErrorResultMaybe"];
  payload: unknown;
};

type GlobalDispatch = SetAppErrorResultMaybeDispatch;

export type { GlobalDispatch, SetAppErrorResultMaybeDispatch };
