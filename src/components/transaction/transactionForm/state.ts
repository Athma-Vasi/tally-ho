import { None, type Option } from "ts-results-es";
import type { AppErrorResult } from "../../../errors";
import type { AppResult } from "../../../types";
import { createOkAppResult } from "../../../utils";
import type {
  PaymentMethodType,
  TransactionCategory,
  TransactionType,
} from "../types";

type TransactionFormState = {
  amountCents: string;
  appErrorResultMaybe: Option<AppErrorResult>;
  cacheResult: AppResult<unknown>;
  cacheWorkerMaybe: Option<Worker>;
  category: TransactionCategory;
  // TODO: Split dateTime into separate date and time fields
  dateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
  fetchResult: AppResult<unknown>;
  fetchWorkerMaybe: Option<Worker>;
  isFormError: boolean;
  isLoading: boolean;
  merchant: string;
  notes: string;
  paymentMethod: PaymentMethodType;
  tags: string; // Tags for categorization
  type: TransactionType; // Expense, Income, or Transfer
};

const initialTransactionFormState: TransactionFormState = {
  amountCents: "",
  appErrorResultMaybe: None,
  cacheResult: createOkAppResult(),
  cacheWorkerMaybe: None,
  category: "car_charging",
  dateTime: new Date().toISOString().split("T")[0],
  fetchResult: createOkAppResult(),
  fetchWorkerMaybe: None,
  isFormError: false,
  isLoading: false,
  merchant: "",
  notes: "",
  paymentMethod: "credit_card",
  tags: "",
  type: "expense",
};

export { initialTransactionFormState };
export type { TransactionFormState };
