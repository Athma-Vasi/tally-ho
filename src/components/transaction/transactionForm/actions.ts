import type { TransactionFormState } from "./state";

type TransactionFormActions = {
  [K in keyof TransactionFormState as `set${Capitalize<string & K>}`]: `set${Capitalize<
    string & K
  >}`;
};

const transactionFormActions: TransactionFormActions = {
  setAmountCents: "setAmountCents",
  setAppErrorResultMaybe: "setAppErrorResultMaybe",
  setCacheResult: "setCacheResult",
  setCacheWorkerMaybe: "setCacheWorkerMaybe",
  setCategory: "setCategory",
  setDateTime: "setDateTime",
  setFetchResult: "setFetchResult",
  setFetchWorkerMaybe: "setFetchWorkerMaybe",
  setIsLoading: "setIsLoading",
  setMerchant: "setMerchant",
  setNotes: "setNotes",
  setPaymentMethod: "setPaymentMethod",
  setTags: "setTags",
  setType: "setType",
};

export { transactionFormActions };
export type { TransactionFormActions };
