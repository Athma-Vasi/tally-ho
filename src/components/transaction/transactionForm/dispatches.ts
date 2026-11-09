import { type Option } from "ts-results-es";
import type { AppErrorResult } from "../../../errors";
import type { AppResult } from "../../../types";
import type {
  PaymentMethodType,
  TransactionCategory,
  TransactionType,
} from "../types";
import { type TransactionFormActions } from "./actions";

type SetAmountCentsTransactionFormDispatch = {
  action: TransactionFormActions["setAmountCents"];
  payload: string;
};

type SetCacheResultTransactionFormDispatch = {
  action: TransactionFormActions["setCacheResult"];
  payload: AppResult<unknown>;
};

type SetCacheWorkerMaybeTransactionFormDispatch = {
  action: TransactionFormActions["setCacheWorkerMaybe"];
  payload: Option<Worker>;
};

type SetCategoryTransactionFormDispatch = {
  action: TransactionFormActions["setCategory"];
  payload: TransactionCategory;
};

type SetDateTimeTransactionFormDispatch = {
  action: TransactionFormActions["setDateTime"];
  payload: string;
};

type SetFetchResultTransactionFormDispatch = {
  action: TransactionFormActions["setFetchResult"];
  payload: AppResult<unknown>;
};

type SetFetchWorkerMaybeTransactionFormDispatch = {
  action: TransactionFormActions["setFetchWorkerMaybe"];
  payload: Option<Worker>;
};

type SetIsLoadingTransactionFormDispatch = {
  action: TransactionFormActions["setIsLoading"];
  payload: boolean;
};

type SetMerchantTransactionFormDispatch = {
  action: TransactionFormActions["setMerchant"];
  payload: string;
};

type SetNotesTransactionFormDispatch = {
  action: TransactionFormActions["setNotes"];
  payload: string;
};

type SetPaymentMethodTransactionFormDispatch = {
  action: TransactionFormActions["setPaymentMethod"];
  payload: PaymentMethodType;
};

type SetAppErrorResultMaybeTransactionFormDispatch = {
  action: TransactionFormActions["setAppErrorResultMaybe"];
  payload: Option<AppErrorResult>;
};

type SetTagsTransactionFormDispatch = {
  action: TransactionFormActions["setTags"];
  payload: string;
};

type SetTypeTransactionFormDispatch = {
  action: TransactionFormActions["setType"];
  payload: TransactionType;
};

type TransactionFormDispatch =
  | SetAmountCentsTransactionFormDispatch
  | SetCacheResultTransactionFormDispatch
  | SetCacheWorkerMaybeTransactionFormDispatch
  | SetCategoryTransactionFormDispatch
  | SetDateTimeTransactionFormDispatch
  | SetFetchResultTransactionFormDispatch
  | SetFetchWorkerMaybeTransactionFormDispatch
  | SetIsLoadingTransactionFormDispatch
  | SetMerchantTransactionFormDispatch
  | SetNotesTransactionFormDispatch
  | SetPaymentMethodTransactionFormDispatch
  | SetAppErrorResultMaybeTransactionFormDispatch
  | SetTagsTransactionFormDispatch
  | SetTypeTransactionFormDispatch;

export type {
  SetAmountCentsTransactionFormDispatch,
  SetAppErrorResultMaybeTransactionFormDispatch,
  SetCacheResultTransactionFormDispatch,
  SetCacheWorkerMaybeTransactionFormDispatch,
  SetCategoryTransactionFormDispatch,
  SetDateTimeTransactionFormDispatch,
  SetFetchResultTransactionFormDispatch,
  SetFetchWorkerMaybeTransactionFormDispatch,
  SetIsLoadingTransactionFormDispatch,
  SetMerchantTransactionFormDispatch,
  SetNotesTransactionFormDispatch,
  SetPaymentMethodTransactionFormDispatch,
  SetTagsTransactionFormDispatch,
  SetTypeTransactionFormDispatch,
  TransactionFormDispatch,
};
