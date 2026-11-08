import { None, Some } from "ts-results-es";
import { globalActions } from "../../../context/globalProvider/actions";
import type { GlobalDispatch } from "../../../context/globalProvider/dispatches";
import { createWorkerMessageHandlerErrorResult } from "../../../errors";
import type { MessageEventCacheWorkerToMain } from "../../../workers/cacheWorker";
import type { MessageEventFetchWorkerToMain } from "../../../workers/fetchWorker";
import { transactionFormActions } from "./actions";

async function handleMessageFromCacheWorker({
  event,
  isComponentMountedRef,
  transactionFormDispatch,
}: {
  event: MessageEventCacheWorkerToMain;
  isComponentMountedRef: React.RefObject<boolean>;
  transactionFormDispatch: React.Dispatch<GlobalDispatch>;
}) {
  if (!isComponentMountedRef.current) {
    return None;
  }

  try {
    if (!event?.data) {
      return None;
    }

    const {
      data: { parcelResult, descendantId },
    } = event;

    const { isOk, value } = parcelResult;
    if (!isOk) {
      transactionFormDispatch({
        action: transactionFormActions.setSafeErrorMaybe,
        payload: Some(
          createWorkerMessageHandlerErrorResult(
            `Error in parcelResult for descendantId: ${descendantId}`,
          ),
        ),
      });
      return None;
    }

    return None;
  } catch (error) {
    transactionFormDispatch({
      action: transactionFormActions.setSafeErrorMaybe,
      payload: Some(
        createWorkerMessageHandlerErrorResult(
          error,
          "Error handling message from Cache Worker",
        ),
      ),
    });
    return None;
  }
}

async function handleMessageFromFetchWorker({
  event,
  isComponentMountedRef,
  transactionFormDispatch,
}: {
  event: MessageEventFetchWorkerToMain;
  isComponentMountedRef?: React.RefObject<boolean>;
  transactionFormDispatch: React.Dispatch<GlobalDispatch>;
}): Promise<None> {
  if (!isComponentMountedRef?.current) {
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

    console.group("Handling message from Fetch Worker");
    console.log("Parcel result:", parcelResult);
    console.log("Descendant ID:", descendantId);
    console.groupEnd();

    return None;
  } catch (error) {
    transactionFormDispatch({
      action: globalActions.setSafeErrorMaybe,
      payload: Some(
        createWorkerMessageHandlerErrorResult(
          error,
          "Error handling message from Fetch Worker",
        ),
      ),
    });
    return None;
  }
}

export { handleMessageFromCacheWorker, handleMessageFromFetchWorker };
