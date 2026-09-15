import type { Transaction } from "../types";

type TransactionCardProps = Transaction;

function TransactionCard(
    {
        amountCents,
        category,
        dateTime,
        id,
        merchant,
        notes,
        paymentMethod,
        tags,
        type,
    }: TransactionCardProps,
) {
    return (
        <div className="transaction-card">
            <h3>{merchant}</h3>
            <p>Amount: ${(amountCents / 100).toFixed(2)}</p>
            <p>Category: {category}</p>
            <p>Date: {new Date(dateTime).toLocaleDateString()}</p>
            <p>Payment Method: {paymentMethod}</p>
            <p>Type: {type}</p>

            {notes.length > 0
                ? (
                    <div>
                        <h4>Notes:</h4>
                        <ul>
                            {notes.split("\n").map((note, index) => (
                                <li key={`${index}-${id}`}>{note}</li>
                            ))}
                        </ul>
                    </div>
                )
                : []}

            {tags.length > 0
                ? (
                    <div>
                        <h4>Tags:</h4>
                        <ul>
                            {tags.split("\n").map((tag, index) => (
                                <li key={`${index}-${tag}-${id}`}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                )
                : []}
        </div>
    );
}

export default TransactionCard;
export type { TransactionCardProps };
