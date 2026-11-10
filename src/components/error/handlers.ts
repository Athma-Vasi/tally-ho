import type { MessageEventLoggerWorkerToMain } from "../../workers/loggerWorker";
import type { ErrorDispatch } from "./dispatches";

async function handleMessageFromLoggerWorker({
  // errorDispatch,
  event,
  isComponentMountedRef,
}: {
  errorDispatch: React.Dispatch<ErrorDispatch>;
  event: MessageEventLoggerWorkerToMain;
  isComponentMountedRef: React.RefObject<boolean>;
}) {
  if (!isComponentMountedRef.current) {
    return;
  }

  const { data } = event;

  console.group("handleMessageFromLoggerWorker");
  console.log("data", data);
  console.groupEnd();
}

export { handleMessageFromLoggerWorker };
