import { parseDispatchAndSetState } from "../../utils";
import { type GlobalActions, globalActions } from "./actions";
import type { GlobalDispatch } from "./dispatches";
import { setSafeErrorMaybeGlobalDispatchSchema } from "./dispatches";
import type { GlobalState } from "./state";

function globalReducer(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  const reducer = globalReducersMap.get(dispatch.action);
  return reducer == null ? state : reducer(state, dispatch);
}

const globalReducersMap: Map<
  GlobalActions[keyof GlobalActions],
  (state: GlobalState, dispatch: GlobalDispatch) => GlobalState
> = new Map([
  [globalActions.setSafeErrorMaybe, globalReducer_setSafeErrorMaybe],
]);

function globalReducer_setSafeErrorMaybe(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return parseDispatchAndSetState({
    dispatch,
    key: "safeErrorMaybe",
    state,
    schema: setSafeErrorMaybeGlobalDispatchSchema,
  });
}

export { globalReducer, globalReducer_setSafeErrorMaybe, globalReducersMap };
