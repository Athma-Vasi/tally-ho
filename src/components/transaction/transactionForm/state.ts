import { type Err, None, type Option } from "ts-results-es";
import type { AppError, ResponseData } from "../../../types";
import type {
    PaymentMethodType,
    TransactionCategory,
    TransactionType,
} from "../types";

type TransactionFormState = {
    amountCents: number;
    cacheWorkerMaybe: Option<Worker>;
    category: TransactionCategory;
    dateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
    fetchWorkerMaybe: Option<Worker>;
    forageWorkerMaybe: Option<Worker>;
    isLoading: boolean;
    merchant: string;
    notes: string;
    paymentMethod: PaymentMethodType;
    responseDataMaybe: Option<Array<ResponseData>>;
    safeErrorMaybe: Option<Err<AppError>>;
    tags: string; // Tags for categorization
    type: TransactionType; // Expense, Income, or Transfer
};

const initialTransactionFormState: TransactionFormState = {
    amountCents: 0,
    cacheWorkerMaybe: None,
    category: "car_charging",
    dateTime: new Date().toISOString(),
    fetchWorkerMaybe: None,
    forageWorkerMaybe: None,
    isLoading: false,
    merchant: "",
    notes: "",
    paymentMethod: "credit_card",
    responseDataMaybe: None,
    safeErrorMaybe: None,
    tags: "",
    type: "expense",
};

export { initialTransactionFormState };
export type { TransactionFormState };
