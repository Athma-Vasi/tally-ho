import { parseDispatchAndSetState } from "../../../utils";
import { type TransactionFormActions, transactionFormActions } from "./actions";
import type { TransactionFormDispatch } from "./dispatches";
import {
    setAmountCentsTransactionFormDispatchSchema,
    setCacheWorkerMaybeTransactionFormDispatchSchema,
    setCategoryTransactionFormDispatchSchema,
    setDateTimeTransactionFormDispatchSchema,
    setFetchWorkerMaybeTransactionFormDispatchSchema,
    setForageWorkerMaybeTransactionFormDispatchSchema,
    setIsLoadingTransactionFormDispatchSchema,
    setMerchantTransactionFormDispatchSchema,
    setNotesTransactionFormDispatchSchema,
    setResponseDataMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
} from "./dispatches";
import type { TransactionFormState } from "./state";

function transactionFormReducer(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    const reducer = transactionFormReducersMap.get(dispatch.action);
    return reducer == null ? state : reducer(state, dispatch);
}

const transactionFormReducersMap: Map<
    TransactionFormActions[keyof TransactionFormActions],
    (
        state: TransactionFormState,
        dispatch: TransactionFormDispatch,
    ) => TransactionFormState
> = new Map([
    [
        transactionFormActions.setAmountCents,
        transactionFormReducer_setAmountCents,
    ],
    [
        transactionFormActions.setCategory,
        transactionFormReducer_setCategory,
    ],
    [
        transactionFormActions.setDateTime,
        transactionFormReducer_setDateTime,
    ],
    [
        transactionFormActions.setForageWorkerMaybe,
        transactionFormReducer_setForageWorkerMaybe,
    ],
    [
        transactionFormActions.setCacheWorkerMaybe,
        transactionFormReducer_setCacheWorkerMaybe,
    ],
    [
        transactionFormActions.setFetchWorkerMaybe,
        transactionFormReducer_setFetchWorkerMaybe,
    ],
    [transactionFormActions.setIsLoading, transactionFormReducer_setIsLoading],
    [
        transactionFormActions.setResponseDataMaybe,
        transactionFormReducer_setResponseDataMaybe,
    ],
    [
        transactionFormActions.setMerchant,
        transactionFormReducer_setMerchant,
    ],
    [
        transactionFormActions.setNotes,
        transactionFormReducer_setNotes,
    ],
    [
        transactionFormActions.setSafeErrorMaybe,
        transactionFormReducer_setSafeErrorMaybe,
    ],
]);

function transactionFormReducer_setAmountCents(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "amountCents",
        state,
        schema: setAmountCentsTransactionFormDispatchSchema, // Replace with the appropriate schema if available
    });
}

function transactionFormReducer_setCategory(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "category",
        state,
        schema: setCategoryTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setDateTime(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "dateTime",
        state,
        schema: setDateTimeTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setForageWorkerMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "forageWorkerMaybe",
        state,
        schema: setForageWorkerMaybeTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setCacheWorkerMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "cacheWorkerMaybe",
        state,
        schema: setCacheWorkerMaybeTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setFetchWorkerMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "fetchWorkerMaybe",
        state,
        schema: setFetchWorkerMaybeTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setIsLoading(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "isLoading",
        state,
        schema: setIsLoadingTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setMerchant(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "merchant",
        state,
        schema: setMerchantTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setNotes(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "notes",
        state,
        schema: setNotesTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setResponseDataMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "responseDataMaybe",
        state,
        schema: setResponseDataMaybeTransactionFormDispatchSchema,
    });
}

function transactionFormReducer_setSafeErrorMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState({
        dispatch,
        key: "safeErrorMaybe",
        state,
        schema: setSafeErrorMaybeTransactionFormDispatchSchema,
    });
}

export {
    transactionFormReducer,
    transactionFormReducer_setCacheWorkerMaybe,
    transactionFormReducer_setFetchWorkerMaybe,
    transactionFormReducer_setForageWorkerMaybe,
    transactionFormReducer_setIsLoading,
    transactionFormReducer_setResponseDataMaybe,
    transactionFormReducer_setSafeErrorMaybe,
    transactionFormReducersMap,
};
