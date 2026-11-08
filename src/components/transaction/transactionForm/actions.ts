import type { TransactionFormState } from "./state";

type TransactionFormActions = {
  [K in keyof TransactionFormState as `set${Capitalize<string & K>}`]: `set${Capitalize<
    string & K
  >}`;
};

const transactionFormActions: TransactionFormActions = {
  setAmountCents: "setAmountCents",
  setCacheResultMaybe: "setCacheResultMaybe",
  setCacheWorkerMaybe: "setCacheWorkerMaybe",
  setCategory: "setCategory",
  setDateTime: "setDateTime",
  setDescendantId: "setDescendantId",
  setFetchResultMaybe: "setFetchResultMaybe",
  setFetchWorkerMaybe: "setFetchWorkerMaybe",
  setIsLoading: "setIsLoading",
  setMerchant: "setMerchant",
  setNotes: "setNotes",
  setPaymentMethod: "setPaymentMethod",
  setSafeErrorMaybe: "setSafeErrorMaybe",
  setTags: "setTags",
  setType: "setType",
};

export { transactionFormActions };
export type { TransactionFormActions };
