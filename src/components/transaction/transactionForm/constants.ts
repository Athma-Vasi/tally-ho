import type { PaymentMethodType, TransactionCategory } from "../types";

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

export { payment_methods, transaction_categories };
