import { globalActions } from "./actions";
import type { GlobalDispatch } from "./dispatches";
import type { GlobalState } from "./state";

function globalReducer(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  switch (dispatch.action) {
    case globalActions.setAppErrorResultMaybe:
      return globalReducer_setAppErrorResultMaybe(state, dispatch);
    default:
      return state;
  }
}

function globalReducer_setAppErrorResultMaybe(
  state: GlobalState,
  dispatch: GlobalDispatch,
): GlobalState {
  return {
    ...state,
    appErrorResultMaybe: dispatch.payload,
  };
}

export { globalReducer, globalReducer_setAppErrorResultMaybe };
