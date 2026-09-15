import { Err, None, type Option } from "ts-results-es";
import type { AppError } from "../../types";

type GlobalState = {
    cacheWorkerMaybe: Option<Worker>;
    fetchWorkerMaybe: Option<Worker>;
    // unique id for each descendant component request
    dispatchesTable: Map<string, React.ActionDispatch<[dispatch: unknown]>>;
    safeErrorMaybe: Option<Err<AppError>>;
};

const initialGlobalState = {
    cacheWorkerMaybe: None,
    fetchWorkerMaybe: None,
    dispatchesTable: new Map(),
    safeErrorMaybe: None,
};

export { initialGlobalState };
export type { GlobalState };
