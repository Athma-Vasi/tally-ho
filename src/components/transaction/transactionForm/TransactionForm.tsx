import { useEffect, useReducer, useRef } from "react";
import { AccessibleTextInput } from "../../accessibleInputs/AccessibleTextInput";
import { transactionFormReducer } from "./reducers";
import { initialTransactionFormState } from "./state";

type TransactionFormProps = {};

function TransactionForm() {
    const [
        transactionFormState,
        transactionFormDispatch,
    ] = useReducer(
        transactionFormReducer,
        // backupStateFromErrorHOC ?? initialRegisterState,
        initialTransactionFormState,
    );
    const {
        amountCents,
        cacheWorkerMaybe,
        category,
        dateTime,
        fetchWorkerMaybe,
        forageWorkerMaybe,
        isLoading,
        merchant,
        notes,
        paymentMethod,
        responseDataMaybe,
        safeErrorMaybe,
        tags,
        type,
    } = transactionFormState;

    const amountCentsInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        amountCentsInputRef.current?.focus?.();
    }, []);

    if (safeErrorMaybe.isSome()) {
        throw safeErrorMaybe.value;
    }

    return null;
}

export default TransactionForm;
export type { TransactionFormProps };
