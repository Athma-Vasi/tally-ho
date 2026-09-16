import { None, Some } from "ts-results-es";
import type { ErrorDispatch } from "../../components/error/dispatches";
import { WorkerMessageHandlerError } from "../../errors";
import { createErrorResult } from "../../utils";
import { globalActions } from "./actions";
import type { MessageEventCacheWorkerToMain } from "./cacheWorker";
import type { GlobalDispatch } from "./dispatches";
import type { MessageEventFetchWorkerToMain } from "./fetchWorker";

async function handleMessageFromCacheWorker(
    { errorDispatch, event, isComponentMountedRef, globalDispatch }: {
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
        const { data: { dataResult, descendantId } } = event;

        if (dataResult.isErr()) {
            globalDispatch(
                {
                    action: globalActions.setSafeErrorMaybe,
                    payload: Some(dataResult),
                },
            );
            return None;
        }
        const dataMaybe = dataResult.value;
        if (dataMaybe.isNone()) {
            globalDispatch(
                {
                    action: globalActions.setSafeErrorMaybe,
                    payload: Some(
                        createErrorResult(
                            new WorkerMessageHandlerError(
                                null,
                                "Cache Worker returned None",
                            ),
                        ),
                    ),
                },
            );
            return None;
        }

        console.group("handleMessageFromCacheWorker");
        console.log("dataMaybe", dataMaybe);
        console.groupEnd();

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
    { errorDispatch, event, isComponentMountedRef, globalDispatch }: {
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
        const { data: { dataResult, descendantId } } = event;

        if (dataResult.isErr()) {
            globalDispatch(
                {
                    action: globalActions.setSafeErrorMaybe,
                    payload: Some(dataResult),
                },
            );
            return None;
        }
        const dataMaybe = dataResult.value;
        if (dataMaybe.isNone()) {
            globalDispatch(
                {
                    action: globalActions.setSafeErrorMaybe,
                    payload: Some(
                        createErrorResult(
                            new WorkerMessageHandlerError(
                                null,
                                "Fetch Worker returned None",
                            ),
                        ),
                    ),
                },
            );
            return None;
        }

        console.group("handleMessageFromFetchWorker");
        console.log("dataMaybe", dataMaybe);
        console.groupEnd();

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
