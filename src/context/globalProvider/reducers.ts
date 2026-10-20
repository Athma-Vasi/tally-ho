import type { DescendantUpdatingForwardingAddress } from "../../types";
import { parseDispatchAndSetState, parseSyncSafe } from "../../utils";
import { type GlobalActions, globalActions } from "./actions";
import type { GlobalDispatch } from "./dispatches";
import {
    setCacheWorkerMaybeGlobalDispatchSchema,
    setDescendantDispatchTableGlobalDispatchSchema,
    setFetchWorkerMaybeGlobalDispatchSchema,
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
    globalActions.setDescendantDispatchTable,
    globalReducer_setDescendantDispatchTable,
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
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "cacheWorkerMaybe",
            state,
            schema: setCacheWorkerMaybeGlobalDispatchSchema,
        },
    );
}

function globalReducer_setDescendantDispatchTable(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    console.log(
        "Handling setDescendantDispatchTable action with dispatch:",
        dispatch,
    );
    const parsedResult = parseSyncSafe(
        {
            object: dispatch,
            schema: setDescendantDispatchTableGlobalDispatchSchema,
        },
    );

    if (parsedResult.isErr()) {
        console.error(
            "Failed to parse setDescendantDispatchTable dispatch:",
            parsedResult.unwrap(),
        );
        return state;
    }

    const parsedMaybe = parsedResult.value;
    if (parsedMaybe.isNone()) {
        console.log(
            "Parsed result is None, ignoring setDescendantDispatchTable dispatch.",
        );
        return state;
    }

    const { descendantAction, descendantDispatch, descendantId } = parsedMaybe
        .value
        .payload as unknown as DescendantUpdatingForwardingAddress;

    console.log(
        "Parsed descendant updating forwarding address:",
        { descendantAction, descendantDispatch, descendantId },
    );

    const updatedTable = new Map(state.descendantDispatchTable).set(
        descendantId,
        {
            descendantAction,
            descendantDispatch,
        },
    );

    console.log(
        "Updated descendant dispatch table:",
        updatedTable,
    );

    return {
        ...state,
        descendantDispatchTable: updatedTable,
    };
}

function globalReducer_setFetchWorkerMaybe(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "fetchWorkerMaybe",
            state,
            schema: setFetchWorkerMaybeGlobalDispatchSchema,
        },
    );
}

function globalReducer_setSafeErrorMaybe(
    state: GlobalState,
    dispatch: GlobalDispatch,
): GlobalState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "safeErrorMaybe",
            state,
            schema: setSafeErrorMaybeGlobalDispatchSchema,
        },
    );
}

export {
    globalReducer,
    globalReducer_setCacheWorkerMaybe,
    globalReducer_setDescendantDispatchTable,
    globalReducer_setFetchWorkerMaybe,
    globalReducer_setSafeErrorMaybe,
    globalReducersMap,
};
