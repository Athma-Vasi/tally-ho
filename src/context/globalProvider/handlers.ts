import { None, Some } from "ts-results-es";
import { WorkerMessageHandlerError } from "../../errors";
import { createErrorResult } from "../../utils";
import { globalActions } from "./actions";
import type { MessageEventCacheWorkerToMain } from "./cacheWorker";
import type { GlobalDispatch } from "./dispatches";
import type { MessageEventFetchWorkerToMain } from "./fetchWorker";
import type { DescendantDispatchTable } from "./state";

async function handleMessageFromCacheWorker({
  descendantDispatchTable,
  event,
  isComponentMountedRef,
  globalDispatch,
}: {
  descendantDispatchTable: DescendantDispatchTable;
  event: MessageEventCacheWorkerToMain;
  isComponentMountedRef: React.RefObject<boolean>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
}) {
  if (!isComponentMountedRef.current) {
    return None;
  }

  try {
    if (!event?.data) {
      return None;
    }

    const {
      data: { dataResult, descendantId },
    } = event;
    const obj = descendantDispatchTable.get(descendantId);
    if (!obj) {
      return None;
    }

    const { descendantAction, descendantDispatch } = obj;
    // forward the dataResult to the descendant using dispatch
    descendantDispatch({
      action: descendantAction,
      payload: Some(dataResult),
    });

    return None;
  } catch (error) {
    globalDispatch({
      action: globalActions.setSafeErrorMaybe,
      payload: Some(
        createErrorResult(
          new WorkerMessageHandlerError(error, "Error handling message from Cache Worker"),
        ),
      ),
    });
    return None;
  }
}

async function handleMessageFromFetchWorker({
  descendantDispatchTable,
  event,
  isComponentMountedRef,
  globalDispatch,
}: {
  descendantDispatchTable: DescendantDispatchTable;
  event: MessageEventFetchWorkerToMain;
  isComponentMountedRef: React.RefObject<boolean>;
  globalDispatch: React.Dispatch<GlobalDispatch>;
}): Promise<None> {
  if (!isComponentMountedRef.current) {
    console.log("Fetch worker message received but component is not mounted.");
    return None;
  }

  try {
    if (!event?.data) {
      console.log("Fetch worker message received but event data is missing.");
      return None;
    }

    const {
      data: { parcelResult, descendantId },
    } = event;
    console.log(
      "Descendant dispatch table for descendantId:",
      descendantId,
      descendantDispatchTable,
    );
    const obj = descendantDispatchTable.get(descendantId);
    if (!obj) {
      console.log(`No descendant found for descendantId: ${descendantId}`);
      console.log("Descendant dispatch table:", descendantDispatchTable);
      return None;
    }

    console.group("Handling message from Fetch Worker");
    console.log("Event data:", event.data);
    console.groupEnd();

    // const { descendantAction, descendantDispatch } = obj;
    // forward the dataResult to the descendant using dispatch
    // descendantDispatch({
    //   action: descendantAction,
    //   payload: Some(dataResult),
    // });

    return None;
  } catch (error) {
    globalDispatch({
      action: globalActions.setSafeErrorMaybe,
      payload: Some(
        createErrorResult(
          new WorkerMessageHandlerError(error, "Error handling message from Fetch Worker"),
        ),
      ),
    });
    return None;
  }
}

export { handleMessageFromCacheWorker, handleMessageFromFetchWorker };
