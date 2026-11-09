import { errorActions } from "./actions";
import type {
  ErrorDispatch,
  SetChildComponentStateErrorDispatch,
  SetLoggerWorkerMaybeErrorDispatch,
} from "./dispatches";
import type { ErrorState } from "./state";

function errorReducer(state: ErrorState, dispatch: ErrorDispatch): ErrorState {
  switch (dispatch.action) {
    case errorActions.setChildComponentState:
      return errorReducer_setChildComponentState(state, dispatch);
    case errorActions.setLoggerWorkerMaybe:
      return errorReducer_setLoggerWorkerMaybe(state, dispatch);
    default:
      return state;
  }
}

function errorReducer_setChildComponentState(
  state: ErrorState,
  dispatch: SetChildComponentStateErrorDispatch,
): ErrorState {
  return {
    ...state,
    childComponentState: {
      ...state.childComponentState,
      ...dispatch.payload,
    },
  };
}

function errorReducer_setLoggerWorkerMaybe(
  state: ErrorState,
  dispatch: SetLoggerWorkerMaybeErrorDispatch,
): ErrorState {
  return {
    ...state,
    loggerWorkerMaybe: dispatch.payload,
  };
}

export {
  errorReducer,
  errorReducer_setChildComponentState,
  errorReducer_setLoggerWorkerMaybe,
};
