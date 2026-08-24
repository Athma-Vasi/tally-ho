import type { ParsedReceipt } from "../../types";

const sampleParsedReceipt1: ParsedReceipt = {
    receiptId: "rcpt_2026_08_23_001",
    confidenceScore: 0.96,
    transactionDateTime: "2026-08-23T18:42:00Z",
    merchant: "Safeway",
    subtotalCents: 4825,
    taxCents: 398,
    tipCents: 0,
    totalCents: 5223,
    paymentMethod: "debit_card",
    notes:
        "Grocery run for the week. Produce, pantry staples, and one oat milk.",
    needsReview: false,
    items: [
        {
            id: "li_1",
            name: "Bananas",
            priceCents: 325,
            purchaseCategory: "groceries",
            quantity: 2,
        },
        {
            id: "li_2",
            name: "Organic Spinach",
            priceCents: 899,
            purchaseCategory: "groceries",
            quantity: 1,
        },
        {
            id: "li_3",
            name: "Vegan Yogurt Cups",
            priceCents: 420,
            purchaseCategory: "groceries",
            quantity: 3,
        },
        {
            id: "li_4",
            name: "Oat Milk",
            priceCents: 1299,
            purchaseCategory: "groceries",
            quantity: 1,
        },
    ],
};

const sampleParsedReceipt2: ParsedReceipt = {
    receiptId: "rcpt_2026_08_17_014",
    confidenceScore: 0.91,
    transactionDateTime: "2026-08-17T12:35:00Z",
    merchant: "Café Solstice",
    subtotalCents: 1825,
    taxCents: 151,
    tipCents: 350,
    totalCents: 2326,
    paymentMethod: "credit_card",
    notes: "Lunch meeting and coffee. One oat milk latte and a salad.",
    needsReview: false,
    items: [
        {
            id: "li_5",
            name: "Mediterranean Bowl",
            priceCents: 1425,
            purchaseCategory: "dining",
            quantity: 1,
        },
        {
            id: "li_6",
            name: "Oat Milk Matcha Latte",
            priceCents: 400,
            purchaseCategory: "dining",
            quantity: 1,
        },
    ],
};

const sampleParsedReceipt3: ParsedReceipt = {
    receiptId: "rcpt_2026_08_12_029",
    confidenceScore: 0.88,
    transactionDateTime: "2026-08-12T19:10:00Z",
    merchant: "The Bay",
    subtotalCents: 2499,
    taxCents: 210,
    tipCents: 0,
    totalCents: 2709,
    paymentMethod: "debit_card",
    notes: "New work shirt and socks. One item was discounted at checkout.",
    needsReview: false,
    items: [
        {
            id: "li_7",
            name: "Work Shirt",
            priceCents: 1699,
            purchaseCategory: "clothing",
            quantity: 1,
        },
        {
            id: "li_8",
            name: "Organic Cotton Socks",
            priceCents: 800,
            purchaseCategory: "clothing",
            quantity: 1,
        },
    ],
};

const sampleParsedReceipt4: ParsedReceipt = {
    receiptId: "rcpt_2026_08_08_083",
    confidenceScore: 0.79,
    transactionDateTime: "2026-08-08T15:20:00Z",
    merchant: "Best Buy",
    subtotalCents: 8999,
    taxCents: 756,
    tipCents: 0,
    totalCents: 9755,
    paymentMethod: "credit_card",
    notes:
        "Wireless keyboard and mouse. Might need verification if tax was added to one device only.",
    needsReview: true,
    items: [
        {
            id: "li_9",
            name: "Vegan Leather Keyboard Sleeve",
            priceCents: 5499,
            purchaseCategory: "electronics",
            quantity: 1,
        },
        {
            id: "li_10",
            name: "Ergonomic Wireless Mouse",
            priceCents: 3500,
            purchaseCategory: "electronics",
            quantity: 1,
        },
    ],
};

const sampleParsedReceipts: ParsedReceipt[] = [
    sampleParsedReceipt1,
    sampleParsedReceipt2,
    sampleParsedReceipt3,
    sampleParsedReceipt4,
];

export {
    sampleParsedReceipt1,
    sampleParsedReceipt2,
    sampleParsedReceipt3,
    sampleParsedReceipt4,
    sampleParsedReceipts,
};
