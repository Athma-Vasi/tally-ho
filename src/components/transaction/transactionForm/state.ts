import { type Err, None, type Option } from "ts-results-es";
import { v4 as uuidv4 } from "uuid";
import type { AppError, AppResult } from "../../../types";
import type {
    PaymentMethodType,
    TransactionCategory,
    TransactionType,
} from "../types";

type TransactionFormState = {
    amountCents: string;
    category: TransactionCategory;
    dateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
    // uuid for the lifetime of component so globalprovider can send
    // parcel received by workers to the requestor (descendant)
    descendantId: string;
    isLoading: boolean;
    merchant: string;
    notes: string;
    paymentMethod: PaymentMethodType;
    dataResultMaybe: Option<AppResult<unknown>>;
    safeErrorMaybe: Option<Err<AppError>>;
    tags: string; // Tags for categorization
    type: TransactionType; // Expense, Income, or Transfer
};

const initialTransactionFormState: TransactionFormState = {
    amountCents: "",
    category: "car_charging",
    dateTime: new Date().toISOString(),
    descendantId: uuidv4(),
    isLoading: false,
    merchant: "",
    notes: "",
    paymentMethod: "credit_card",
    dataResultMaybe: None,
    safeErrorMaybe: None,
    tags: "",
    type: "expense",
};

export { initialTransactionFormState };
export type { TransactionFormState };
