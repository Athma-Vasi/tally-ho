import { parseDispatchAndSetState } from "../../../utils";
import { type TransactionFormActions, transactionFormActions } from "./actions";
import type { TransactionFormDispatch } from "./dispatches";
import {
    setAmountCentsTransactionFormDispatchSchema,
    setCategoryTransactionFormDispatchSchema,
    setDataResultMaybeTransactionFormDispatchSchema,
    setDateTimeTransactionFormDispatchSchema,
    setDescendantIdTransactionFormDispatchSchema,
    setIsLoadingTransactionFormDispatchSchema,
    setMerchantTransactionFormDispatchSchema,
    setNotesTransactionFormDispatchSchema,
    setPaymentMethodTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
    setTagsTransactionFormDispatchSchema,
    setTypeTransactionFormDispatchSchema,
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
        transactionFormActions.setDescendantId,
        transactionFormReducer_setDescendantId,
    ],
    [transactionFormActions.setIsLoading, transactionFormReducer_setIsLoading],
    [
        transactionFormActions.setDataResultMaybe,
        transactionFormReducer_setDataResultMaybe,
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
        transactionFormActions.setPaymentMethod,
        transactionFormReducer_setPaymentMethod,
    ],
    [
        transactionFormActions.setSafeErrorMaybe,
        transactionFormReducer_setSafeErrorMaybe,
    ],
    [
        transactionFormActions.setTags,
        transactionFormReducer_setTags,
    ],
    [
        transactionFormActions.setType,
        transactionFormReducer_setType,
    ],
]);

function transactionFormReducer_setAmountCents(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "amountCents",
            state,
            schema: setAmountCentsTransactionFormDispatchSchema, // Replace with the appropriate schema if available
        },
    );
}

function transactionFormReducer_setCategory(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "category",
            state,
            schema: setCategoryTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setDateTime(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "dateTime",
            state,
            schema: setDateTimeTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setDescendantId(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "descendantId",
            state,
            schema: setDescendantIdTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setIsLoading(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "isLoading",
            state,
            schema: setIsLoadingTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setMerchant(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "merchant",
            state,
            schema: setMerchantTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setNotes(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "notes",
            state,
            schema: setNotesTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setPaymentMethod(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "paymentMethod",
            state,
            schema: setPaymentMethodTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setDataResultMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "dataResultMaybe",
            state,
            schema: setDataResultMaybeTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setSafeErrorMaybe(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "safeErrorMaybe",
            state,
            schema: setSafeErrorMaybeTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setTags(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "tags",
            state,
            schema: setTagsTransactionFormDispatchSchema,
        },
    );
}

function transactionFormReducer_setType(
    state: TransactionFormState,
    dispatch: TransactionFormDispatch,
): TransactionFormState {
    return parseDispatchAndSetState(
        {
            dispatch,
            key: "type",
            state,
            schema: setTypeTransactionFormDispatchSchema,
        },
    );
}

export {
    transactionFormReducer,
    transactionFormReducer_setAmountCents,
    transactionFormReducer_setCategory,
    transactionFormReducer_setDataResultMaybe,
    transactionFormReducer_setDateTime,
    transactionFormReducer_setDescendantId,
    transactionFormReducer_setIsLoading,
    transactionFormReducer_setMerchant,
    transactionFormReducer_setNotes,
    transactionFormReducer_setPaymentMethod,
    transactionFormReducer_setSafeErrorMaybe,
    transactionFormReducer_setTags,
    transactionFormReducer_setType,
    transactionFormReducersMap,
};
