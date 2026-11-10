import { None, Some } from "ts-results-es";
import { createWorkerMessageHandlerErrorResult } from "../../../errors";
import { createAppResultFromMessageResult } from "../../../utils";
import type { MessageEventCacheWorkerToMain } from "../../../workers/cacheWorker";
import type { MessageEventFetchWorkerToMain } from "../../../workers/fetchWorker";
import { transactionFormActions } from "./actions";
import type { TransactionFormDispatch } from "./dispatches";

async function handleMessageFromCacheWorker({
  event,
  isComponentMountedRef,
  transactionFormDispatch,
}: {
  event: MessageEventCacheWorkerToMain;
  isComponentMountedRef: React.RefObject<boolean>;
  transactionFormDispatch: React.Dispatch<TransactionFormDispatch>;
}) {
  if (!isComponentMountedRef.current) {
    return None;
  }

  try {
    if (!event?.data) {
      return None;
    }

    const { data } = event;

    const { isOk, error } = data;
    if (!isOk) {
      transactionFormDispatch({
        action: transactionFormActions.setAppErrorResultMaybe,
        payload: Some(
          createWorkerMessageHandlerErrorResult(
            error,
            "Error handling message from Cache Worker",
          ),
        ),
      });
      return None;
    }

    return None;
  } catch (error) {
    transactionFormDispatch({
      action: transactionFormActions.setAppErrorResultMaybe,
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
  transactionFormDispatch: React.Dispatch<TransactionFormDispatch>;
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

    const { data } = event;

    // convert to AppResult if necessary (assuming data is already in the correct format)
    const fetchResult = createAppResultFromMessageResult(data);

    transactionFormDispatch({
      action: transactionFormActions.setFetchResult,
      payload: fetchResult,
    });

    transactionFormDispatch({
      action: transactionFormActions.setAppErrorResultMaybe,
      payload: None,
    });

    transactionFormDispatch({
      action: transactionFormActions.setIsLoading,
      payload: false,
    });

    return None;
  } catch (error) {
    transactionFormDispatch({
      action: transactionFormActions.setAppErrorResultMaybe,
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
