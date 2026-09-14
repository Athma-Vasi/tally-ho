import type { TransactionFormState } from "./state";

type TransactionFormActions = {
    [K in keyof TransactionFormState as `set${Capitalize<string & K>}`]:
        `set${Capitalize<
            string & K
        >}`;
};

const transactionFormActions: TransactionFormActions = {
    setAmountCents: "setAmountCents",
    setCacheWorkerMaybe: "setCacheWorkerMaybe",
    setCategory: "setCategory",
    setDateTime: "setDateTime",
    setFetchWorkerMaybe: "setFetchWorkerMaybe",
    setForageWorkerMaybe: "setForageWorkerMaybe",
    setIsLoading: "setIsLoading",
    setMerchant: "setMerchant",
    setNotes: "setNotes",
    setPaymentMethod: "setPaymentMethod",
    setResponseDataMaybe: "setResponseDataMaybe",
    setSafeErrorMaybe: "setSafeErrorMaybe",
    setTags: "setTags",
    setType: "setType",
};

export { transactionFormActions };
export type { TransactionFormActions };
