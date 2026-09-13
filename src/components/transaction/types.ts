type TransactionCategory =
    | "car_charging"
    | "clothing"
    | "dining"
    | "electronics"
    | "entertainment"
    | "groceries"
    | "healthcare"
    | "other"
    | "rent";

type PaymentMethodType =
    | "automatic_transfer"
    | "cash"
    | "credit_card"
    | "debit_card"
    | "gift_card"
    | "other";

type TransactionType = "expense" | "income" | "other" | "transfer";

type Transaction = {
    amountCents: number;
    category: TransactionCategory;
    dateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
    id: string;
    merchant: string;
    notes: string[];
    paymentMethod: PaymentMethodType;
    tags: string[]; // Tags for categorization
    type: TransactionType; // Expense, Income, or Transfer
};

export type {
    PaymentMethodType,
    Transaction,
    TransactionCategory,
    TransactionType,
};
