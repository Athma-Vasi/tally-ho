import type { GlobalState } from "./state";

type GlobalActions = {
    [K in keyof GlobalState as `set${Capitalize<string & K>}`]:
        `set${Capitalize<
            string & K
        >}`;
};

const globalActions: GlobalActions = {
    setCacheWorkerMaybe: "setCacheWorkerMaybe",
    setFetchWorkerMaybe: "setFetchWorkerMaybe",
    setDispatchesTable: "setDispatchesTable",
    setSafeErrorMaybe: "setSafeErrorMaybe",
};

export { globalActions };
export type { GlobalActions };
