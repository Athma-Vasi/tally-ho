import { None, Some } from "ts-results-es";
import type { ErrorDispatch } from "../../components/error/dispatches";
import { WorkerMessageHandlerError } from "../../errors";
import { createErrorResult } from "../../utils";
import { globalActions } from "./actions";
import type { MessageEventCacheWorkerToMain } from "./cacheWorker";
import type { GlobalDispatch } from "./dispatches";
import type { MessageEventFetchWorkerToMain } from "./fetchWorker";
import type { DescendantDispatchTable } from "./state";

async function handleMessageFromCacheWorker(
    {
        descendantDispatchTable,
        errorDispatch,
        event,
        isComponentMountedRef,
        globalDispatch,
    }: {
        descendantDispatchTable: DescendantDispatchTable;
        errorDispatch: React.Dispatch<ErrorDispatch>;
        event: MessageEventCacheWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        globalDispatch: React.Dispatch<GlobalDispatch>;
    },
) {
    if (!isComponentMountedRef.current) {
        return None;
    }

    try {
        if (!event?.data) {
            return None;
        }

        const { data: { dataResult, descendantId } } = event;
        const obj = descendantDispatchTable.get(descendantId);
        if (!obj) {
            return None;
        }

        const { descendantAction, descendantDispatch } = obj;
        // forward the dataResult to the descendant using dispatch
        descendantDispatch(
            {
                action: descendantAction,
                payload: Some(dataResult),
            },
        );

        return None;
    } catch (error) {
        globalDispatch(
            {
                action: globalActions.setSafeErrorMaybe,
                payload: Some(
                    createErrorResult(
                        new WorkerMessageHandlerError(
                            error,
                            "Error handling message from Cache Worker",
                        ),
                    ),
                ),
            },
        );
        return None;
    }
}

async function handleMessageFromFetchWorker(
    {
        descendantDispatchTable,
        errorDispatch,
        event,
        isComponentMountedRef,
        globalDispatch,
    }: {
        descendantDispatchTable: DescendantDispatchTable;
        errorDispatch: React.Dispatch<ErrorDispatch>;
        event: MessageEventFetchWorkerToMain;
        isComponentMountedRef: React.RefObject<boolean>;
        globalDispatch: React.Dispatch<GlobalDispatch>;
    },
): Promise<None> {
    if (!isComponentMountedRef.current) {
        return None;
    }

    try {
        if (!event?.data) {
            return None;
        }

        const { data: { dataResult, descendantId } } = event;
        const obj = descendantDispatchTable.get(descendantId);
        if (!obj) {
            return None;
        }

        const { descendantAction, descendantDispatch } = obj;
        // forward the dataResult to the descendant using dispatch
        descendantDispatch(
            {
                action: descendantAction,
                payload: Some(dataResult),
            },
        );

        return None;
    } catch (error) {
        globalDispatch(
            {
                action: globalActions.setSafeErrorMaybe,
                payload: Some(
                    createErrorResult(
                        new WorkerMessageHandlerError(
                            error,
                            "Error handling message from Fetch Worker",
                        ),
                    ),
                ),
            },
        );
        return None;
    }
}

export { handleMessageFromCacheWorker, handleMessageFromFetchWorker };
