import type { TransactionFormState } from "./state";

type TransactionFormActions = {
    [K in keyof TransactionFormState as `set${Capitalize<string & K>}`]:
        `set${Capitalize<
            string & K
        >}`;
};

const TransactionFormActions: TransactionFormActions = {
    setForageWorkerMaybe: "setForageWorkerMaybe",
    setCacheWorkerMaybe: "setCacheWorkerMaybe",
    setFetchWorkerMaybe: "setFetchWorkerMaybe",
    setIsLoading: "setIsLoading",
    setPassword: "setPassword",
    setResponseDataMaybe: "setResponseDataMaybe",
    setSafeErrorMaybe: "setSafeErrorMaybe",
    setUsername: "setUsername",
};

export { TransactionFormActions };
export type { TransactionFormActions };
