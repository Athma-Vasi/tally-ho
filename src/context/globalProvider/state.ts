import { None } from "ts-results-es";

type GlobalState = {
    cacheWorkerMaybe: None;
    fetchWorkerMaybe: None;
    forageWorkerMaybe: None;
    // unique id for each descendant component request
    dispatchesTable: Map<string, React.ActionDispatch<[dispatch: unknown]>>;
};

const initialGlobalState = {
    cacheWorkerMaybe: None,
    fetchWorkerMaybe: None,
    forageWorkerMaybe: None,
    dispatchesTable: new Map(),
};

export { initialGlobalState };
export type { GlobalState };
