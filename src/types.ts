type PurchaseCategory =
    | "rent"
    | "groceries"
    | "dining"
    | "electronics"
    | "clothing"
    | "entertainment"
    | "car_charging"
    | "healthcare"
    | "other";

type PaymentMethodType =
    | "cash"
    | "credit_card"
    | "debit_card"
    | "gift_card"
    | "other";

type LineItem = {
    id: string;
    name: string;
    priceCents: number;
    purchaseCategory: PurchaseCategory;
    quantity: number;
};

type ParsedReceipt = {
    // Metadata
    receiptId: string;
    confidenceScore: number; // Overall parsing confidence (0.0 to 1.0)

    // Date & Merchant
    transactionDateTime: string; // ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ
    merchant: string;

    // Financial breakdown (all in base units / cents)
    subtotalCents: number;
    taxCents: number;
    tipCents: number;
    totalCents: number;

    // Items & Payments
    items: LineItem[];
    paymentMethod: PaymentMethodType;

    // App-specific flags
    notes: string;
    needsReview: boolean; // Flagged true if LLM detects missing totals or ambiguities
};

export type { LineItem, ParsedReceipt, PaymentMethodType, PurchaseCategory };
