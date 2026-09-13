import type { TransactionFormState } from "./state";

type TransactionFormActions = {
    [K in keyof TransactionFormState as `set${Capitalize<string & K>}`]:
        `set${Capitalize<
            string & K
        >}`;
};

const transactionFormActions: TransactionFormActions = {
    setForageWorkerMaybe: "setForageWorkerMaybe",
    setCacheWorkerMaybe: "setCacheWorkerMaybe",
    setFetchWorkerMaybe: "setFetchWorkerMaybe",
    setIsLoading: "setIsLoading",
    setResponseDataMaybe: "setResponseDataMaybe",
    setSafeErrorMaybe: "setSafeErrorMaybe",
};

export { transactionFormActions };
export type { TransactionFormActions };
