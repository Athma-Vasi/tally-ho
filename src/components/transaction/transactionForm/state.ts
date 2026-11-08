import { type Err, None, type Option } from "ts-results-es";
import { v4 as uuidv4 } from "uuid";
import type { AppError } from "../../../errors";
import type { AppResult } from "../../../types";
import type {
  PaymentMethodType,
  TransactionCategory,
  TransactionType,
} from "../types";

type TransactionFormState = {
  amountCents: string;
  cacheResultMaybe: Option<AppResult<unknown>>;
  cacheWorkerMaybe: Option<Worker>;
  category: TransactionCategory;
  dateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
  // uuid for the lifetime of component so globalProvider can forward
  // parcel received from workers to the requestor (descendant)
  descendantId: string;
  fetchResultMaybe: Option<AppResult<unknown>>;
  fetchWorkerMaybe: Option<Worker>;
  isLoading: boolean;
  merchant: string;
  notes: string;
  paymentMethod: PaymentMethodType;
  safeErrorMaybe: Option<Err<AppError>>;
  tags: string; // Tags for categorization
  type: TransactionType; // Expense, Income, or Transfer
};

const initialTransactionFormState: TransactionFormState = {
  amountCents: "",
  cacheResultMaybe: None,
  cacheWorkerMaybe: None,
  category: "car_charging",
  dateTime: new Date().toISOString(),
  descendantId: uuidv4(),
  fetchResultMaybe: None,
  fetchWorkerMaybe: None,
  isLoading: false,
  merchant: "",
  notes: "",
  paymentMethod: "credit_card",
  safeErrorMaybe: None,
  tags: "",
  type: "expense",
};

export { initialTransactionFormState };
export type { TransactionFormState };
