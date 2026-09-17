import { useEffect, useReducer, useRef } from "react";
import { Some } from "ts-results-es";
import { globalActions } from "../../../context/globalProvider/actions";
import type { MessageEventMainToFetchWorker } from "../../../context/globalProvider/fetchWorker";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { sendMessageToWorker } from "../../../utils";
import { AccessibleButtonInput } from "../../accessibleInputs/AccessibleButtonInput";
import { AccessibleSelectInput } from "../../accessibleInputs/AccessibleSelectInput";
import { AccessibleTextInput } from "../../accessibleInputs/AccessibleTextInput";
import { errorActions } from "../../error/actions";
import type { ErrorDispatch } from "../../error/dispatches";
import { transactionFormActions } from "./actions";
import {
    payment_methods,
    transaction_categories,
    transaction_types,
} from "./constants";
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
        dataResultMaybe,
        dateTime,
        descendantId,
        fetchWorkerMaybe,
        forageWorkerMaybe,
        isLoading,
        merchant,
        notes,
        paymentMethod,
        safeErrorMaybe,
        tags,
        type,
    } = transactionFormState;

    const {
        globalDispatch,
        globalState,
    } = useGlobalState();

    const amountCentsInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        amountCentsInputRef.current?.focus?.();
    }, []);

    // after first mount, set up a forwarding address to globalProvider for worker parcels
    useEffect(() => {
        globalDispatch(
            {
                action: globalActions.setDescendantDispatchTable,
                payload: {
                    descendantId,
                    descendantAction: transactionFormActions.setDataResultMaybe,
                    descendantDispatch: transactionFormDispatch,
                },
            },
        );
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

    const dateTimeTextElement = (
        <AccessibleTextInput
            errorAction={errorActions.setChildComponentState}
            dispatch={transactionFormDispatch}
            errorDispatch={errorDispatch}
            label="Date and Time: "
            name="dateTime"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const { currentTarget: { value } } = event;
            }}
            setValueAction={transactionFormActions.setDateTime}
            type="datetime-local"
            validationRegexes={[]}
            value={dateTime}
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
            }}
            setValueAction={transactionFormActions.setTags}
            validationRegexes={tags_validation_regexes}
            value={tags}
        />
    );

    const typeSelectElement = (
        <AccessibleSelectInput
            dataOptions={transaction_types}
            dispatch={transactionFormDispatch}
            name="type"
            setValueAction={transactionFormActions.setType}
            value={type}
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

                // send message to worker with unique descendantId
                sendMessageToWorker<MessageEventMainToFetchWorker>(
                    {
                        actions: transactionFormActions,
                        dispatch: transactionFormDispatch,
                        message: {
                            descendantId,
                            requestInit: {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            },
                            url: "https://jsonplaceholder.typicode.com/posts",
                        },
                        workerMaybe: fetchWorkerMaybe,
                    },
                );
            }}
            setIsLoadingAction={transactionFormActions.setIsLoading}
            type="submit"
        />
    );

    console.group("TransactionForm Render");
    console.log("transactionFormState", transactionFormState);
    console.log("childComponentState", backupStateFromErrorHOC);
    console.log("globalState", globalState);
    console.log("Some", Some("test"));
    console.groupEnd();

    return (
        <div className="transaction-form">
            {amountCentsTextElement}
            {categorySelectElement}
            {dateTimeTextElement}
            {merchantTextElement}
            {notesTextElement}
            {paymentMethodSelectElement}
            {tagsTextElement}
            {typeSelectElement}
            {submitButtonElement}
        </div>
    );
}

export default TransactionForm;
export type { TransactionFormProps };
