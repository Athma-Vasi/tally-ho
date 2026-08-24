import type { ParsedReceipt } from "../../../types";

type TransactionCardProps = ParsedReceipt;

function TransactionCard(
    {
        confidenceScore,
        items,
        merchant,
        needsReview,
        notes,
        paymentMethod,
        receiptId,
        subtotalCents,
        taxCents,
        tipCents,
        totalCents,
        transactionDateTime,
    }: TransactionCardProps,
) {
    return null;
}
