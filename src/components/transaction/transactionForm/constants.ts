import type {
    PaymentMethodType,
    TransactionCategory,
    TransactionType,
} from "../types";

const transaction_categories: Array<TransactionCategory> = [
    "car_charging",
    "clothing",
    "dining",
    "electronics",
    "entertainment",
    "groceries",
    "healthcare",
    "other",
    "rent",
];

const payment_methods: Array<PaymentMethodType> = [
    "automatic_transfer",
    "cash",
    "credit_card",
    "debit_card",
    "gift_card",
    "other",
];

const transaction_types: Array<TransactionType> = [
    "income",
    "expense",
    "transfer",
    "other",
];

export { payment_methods, transaction_categories, transaction_types };
