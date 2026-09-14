import type { ValidationRegexes } from "../../../types";

const amountCents_validation_regexes: ValidationRegexes = [
    [
        /^0$|^[1-9]\d*$/,
        "Amount in cents must be a positive number.",
    ],
];

const category_validation_regexes: ValidationRegexes = [
    [
        /^(car_charging|clothing|dining|electronics|entertainment|groceries|healthcare|other|rent)$/,
        "Category must be a valid transaction category.",
    ],
];

const dateTime_validation_regexes: ValidationRegexes = [
    [
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
        "Date and time must be in the format YYYY-MM-DDTHH:MM:SSZ.",
    ],
];

const merchant_validation_regexes: ValidationRegexes = [
    [/^.{1,100}$/, "Merchant name must be between 1 and 100 characters long."],
    [
        /^(?!\d+$).+$/,
        "Merchant name cannot be all numbers.",
    ],
];

const notes_validation_regexes: ValidationRegexes = [
    [/^.{0,500}$/, "Notes must be between 0 and 500 characters long."],
];

const paymentMethod_validation_regexes: ValidationRegexes = [
    [
        /^(automatic_transfer|cash|credit_card|debit_card|gift_card|other)$/,
        "Payment method must be a valid type.",
    ],
];

const tags_validation_regexes: ValidationRegexes = [
    [/^.{0,50}$/, "Tags must be between 0 and 50 characters long."],
    // tags cannot be all numbers
    [
        /^(?!\d+$).+$/,
        "Tags cannot be all numbers.",
    ],
];

const transactionType_validation_regexes: ValidationRegexes = [
    [
        /^(expense|income|other|transfer)$/,
        "Transaction type must be a valid type.",
    ],
];

export {
    amountCents_validation_regexes,
    category_validation_regexes,
    dateTime_validation_regexes,
    merchant_validation_regexes,
    notes_validation_regexes,
    paymentMethod_validation_regexes,
    tags_validation_regexes,
    transactionType_validation_regexes,
};
