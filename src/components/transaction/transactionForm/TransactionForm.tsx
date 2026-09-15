import { useEffect, useReducer, useRef } from "react";
import { AccessibleButtonInput } from "../../accessibleInputs/AccessibleButtonInput";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../../accessibleInputs/AccessibleTextInput";
import { errorActions } from "../../error/actions";
import type { ErrorDispatch } from "../../error/dispatches";
import { transactionFormActions } from "./actions";
import { payment_methods, transaction_categories } from "./constants";
import { transactionFormReducer } from "./reducers";
import {
    amountCents_validation_regexes,
    merchant_validation_regexes,
    notes_validation_regexes,
    tags_validation_regexes,
} from "./regexes";
import {
    initialTransactionFormState,
    type TransactionFormState,
} from "./state";

type TransactionFormProps = {
    // this component's back-up state from ErrorBoundary
    childComponentState: TransactionFormState;
    errorDispatch: React.ActionDispatch<[dispatch: ErrorDispatch]>;
};

function TransactionForm(
    { childComponentState: backupStateFromErrorHOC, errorDispatch }:
        TransactionFormProps,
) {
    const [
        transactionFormState,
        transactionFormDispatch,
    ] = useReducer(
        transactionFormReducer,
        backupStateFromErrorHOC ?? initialTransactionFormState,
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

    const amountCentsTextElement = (
        <AccessibleTextInput
            errorAction={errorActions.setChildComponentState}
            dispatch={transactionFormDispatch}
            errorDispatch={errorDispatch}
            label="Amount (in cents): "
            name="amountCents"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { currentTarget: { value } } = event;

                // sendMessageToWorker<MessageEventMainToCacheWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["amountCents", value],
                //     },
                //     workerMaybe: cacheWorkerMaybe,
                // });

                // sendMessageToWorker<MessageEventMainToForageWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["amountCents", value],
                //     },
                //     workerMaybe: forageWorkerMaybe,
                // });
            }}
            ref={amountCentsInputRef}
            setValueAction={transactionFormActions.setAmountCents}
            validationRegexes={amountCents_validation_regexes}
            value={amountCents}
        />
    );

    const categorySelectElement = (
        <AccessibleSelectInput
            dataOptions={transaction_categories}
            dispatch={transactionFormDispatch}
            name="transactionCategory"
            setValueAction={transactionFormActions.setCategory}
            value={category}
        />
    );

    const merchantTextElement = (
        <AccessibleTextInput
            errorAction={errorActions.setChildComponentState}
            dispatch={transactionFormDispatch}
            errorDispatch={errorDispatch}
            label="Merchant: "
            name="merchant"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { currentTarget: { value } } = event;

                // sendMessageToWorker<MessageEventMainToCacheWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["merchant", value],
                //     },
                //     workerMaybe: cacheWorkerMaybe,
                // });

                // sendMessageToWorker<MessageEventMainToForageWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["merchant", value],
                //     },
                //     workerMaybe: forageWorkerMaybe,
                // });
            }}
            setValueAction={transactionFormActions.setMerchant}
            validationRegexes={merchant_validation_regexes}
            value={merchant}
        />
    );

    const notesTextElement = (
        <AccessibleTextInput
            errorAction={errorActions.setChildComponentState}
            dispatch={transactionFormDispatch}
            errorDispatch={errorDispatch}
            label="Notes: "
            name="notes"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { currentTarget: { value } } = event;

                // sendMessageToWorker<MessageEventMainToCacheWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["notes", value],
                //     },
                //     workerMaybe: cacheWorkerMaybe,
                // });

                // sendMessageToWorker<MessageEventMainToForageWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["notes", value],
                //     },
                //     workerMaybe: forageWorkerMaybe,
                // });
            }}
            setValueAction={transactionFormActions.setNotes}
            validationRegexes={notes_validation_regexes}
            value={notes}
        />
    );

    const paymentMethodSelectElement = (
        <AccessibleSelectInput
            dataOptions={payment_methods}
            dispatch={transactionFormDispatch}
            name="paymentMethod"
            setValueAction={transactionFormActions.setCategory}
            value={paymentMethod}
        />
    );

    const tagsTextElement = (
        <AccessibleTextInput
            errorAction={errorActions.setChildComponentState}
            dispatch={transactionFormDispatch}
            errorDispatch={errorDispatch}
            label="Tags: "
            name="tags"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { currentTarget: { value } } = event;

                // sendMessageToWorker<MessageEventMainToCacheWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["tags", value],
                //     },
                //     workerMaybe: cacheWorkerMaybe,
                // });

                // sendMessageToWorker<MessageEventMainToForageWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         kind: "set",
                //         payload: ["tags", value],
                //     },
                //     workerMaybe: forageWorkerMaybe,
                // });
            }}
            setValueAction={transactionFormActions.setTags}
            validationRegexes={tags_validation_regexes}
            value={tags}
        />
    );

    const submitButtonElement = (
        <AccessibleButtonInput
            disabled={isLoading}
            dispatch={transactionFormDispatch}
            isLoading={isLoading}
            kind="submit"
            name="submit"
            onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
                event.preventDefault();

                // sendMessageToWorker<MessageEventMainToFetchWorker>({
                //     actions: transactionFormActions,
                //     dispatch: transactionFormDispatch,
                //     message: {
                //         requestInit: {
                //             method: "GET",
                //             headers: {
                //                 "Content-Type": "application/json",
                //             },
                //         },
                //         url: "https://jsonplaceholder.typicode.com/posts",
                //     },
                //     workerMaybe: fetchWorkerMaybe,
                // });
            }}
            setIsLoadingAction={transactionFormActions.setIsLoading}
            type="submit"
        />
    );

    console.group("TransactionForm Render");
    console.log("transactionFormState", transactionFormState);
    console.log("childComponentState", backupStateFromErrorHOC);
    console.groupEnd();

    return (
        <>
            {amountCentsTextElement}
            {categorySelectElement}
            {merchantTextElement}
            {notesTextElement}
            {paymentMethodSelectElement}
            {tagsTextElement}
            {submitButtonElement}
        </>
    );
}

export default TransactionForm;
export type { TransactionFormProps };
