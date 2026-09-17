import { Err, None, type Option } from "ts-results-es";
import type { AppError } from "../../types";

type DescendantDispatchTable = Map<
    string,
    {
        descendantAction: string;
        descendantDispatch: React.ActionDispatch<[dispatch: unknown]>;
    }
>;

type GlobalState = {
    cacheWorkerMaybe: Option<Worker>;
    fetchWorkerMaybe: Option<Worker>;
    // unique id for each descendant component request
    descendantDispatchTable: DescendantDispatchTable;
    safeErrorMaybe: Option<Err<AppError>>;
};

const initialGlobalState = {
    cacheWorkerMaybe: None,
    fetchWorkerMaybe: None,
    descendantDispatchTable: new Map(),
    safeErrorMaybe: None,
};

export { initialGlobalState };
export type { DescendantDispatchTable, GlobalState };
