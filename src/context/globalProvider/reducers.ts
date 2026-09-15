import { parseDispatchAndSetState } from "../../utils";
import { type GlobalActions, globalActions } from "./actions";
import type { GlobalDispatch } from "./dispatches";
import {
    setCacheWorkerMaybeGlobalDispatchSchema,
    setDispatchesTableGlobalDispatchSchema,
    setFetchWorkerMaybeGlobalDispatchSchema,
    setForageWorkerMaybeGlobalDispatchSchema,
    setSafeErrorMaybeGlobalDispatchSchema,
} from "./dispatches";
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
    (
        state: GlobalState,
        dispatch: GlobalDispatch,
    ) => GlobalState
> = new Map([[
    globalActions.setCacheWorkerMaybe,
    globalReducer_setCacheWorkerMaybe,
], [
    globalActions.setForageWorkerMaybe,
    globalReducer_setForageWorkerMaybe,
], [
    globalActions.setDispatchesTable,
    globalReducer_setDispatchesTable,
], [
    globalActions.setFetchWorkerMaybe,
    globalReducer_setFetchWorkerMaybe,
], [
    globalActions.setSafeErrorMaybe,
    globalReducer_setSafeErrorMaybe,
]]);

function globalReducer_setCacheWorkerMaybe(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState({
        dispatch,
        key: "cacheWorkerMaybe",
        state,
        schema: setCacheWorkerMaybeGlobalDispatchSchema,
    });
}

function globalReducer_setDispatchesTable(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState({
        dispatch,
        key: "dispatchesTable",
        state,
        schema: setDispatchesTableGlobalDispatchSchema,
    });
}

function globalReducer_setForageWorkerMaybe(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState({
        dispatch,
        key: "forageWorkerMaybe",
        state,
        schema: setForageWorkerMaybeGlobalDispatchSchema,
    });
}

function globalReducer_setFetchWorkerMaybe(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState({
        dispatch,
        key: "fetchWorkerMaybe",
        state,
        schema: setFetchWorkerMaybeGlobalDispatchSchema,
    });
}

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

export {
    globalReducer,
    globalReducer_setCacheWorkerMaybe,
    globalReducer_setDispatchesTable,
    globalReducer_setFetchWorkerMaybe,
    globalReducer_setForageWorkerMaybe,
    globalReducer_setSafeErrorMaybe,
    globalReducersMap,
};
