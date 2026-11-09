import { transactionFormActions } from "./actions";
import type {
  SetAmountCentsTransactionFormDispatch,
  SetAppErrorResultMaybeTransactionFormDispatch,
  SetCacheResultTransactionFormDispatch,
  SetCacheWorkerMaybeTransactionFormDispatch,
  SetCategoryTransactionFormDispatch,
  SetDateTimeTransactionFormDispatch,
  SetFetchResultTransactionFormDispatch,
  SetFetchWorkerMaybeTransactionFormDispatch,
  SetIsLoadingTransactionFormDispatch,
  SetMerchantTransactionFormDispatch,
  SetNotesTransactionFormDispatch,
  SetPaymentMethodTransactionFormDispatch,
  SetTagsTransactionFormDispatch,
  SetTypeTransactionFormDispatch,
  TransactionFormDispatch,
} from "./dispatches";
import type { TransactionFormState } from "./state";

function transactionFormReducer(
  state: TransactionFormState,
  dispatch: TransactionFormDispatch,
): TransactionFormState {
  // const reducer = transactionFormReducersMap.get(dispatch.action);
  // return reducer == null ? state : reducer(state, dispatch);
  switch (dispatch.action) {
    case transactionFormActions.setAmountCents:
      return transactionFormReducer_setAmountCents(state, dispatch);
    case transactionFormActions.setAppErrorResultMaybe:
      return transactionFormReducer_setAppErrorResultMaybe(state, dispatch);
    case transactionFormActions.setCacheResult:
      return transactionFormReducer_setCacheResult(state, dispatch);
    case transactionFormActions.setCacheWorkerMaybe:
      return transactionFormReducer_setCacheWorkerMaybe(state, dispatch);
    case transactionFormActions.setCategory:
      return transactionFormReducer_setCategory(state, dispatch);
    case transactionFormActions.setDateTime:
      return transactionFormReducer_setDateTime(state, dispatch);
    case transactionFormActions.setFetchResult:
      return transactionFormReducer_setFetchResult(state, dispatch);
    case transactionFormActions.setFetchWorkerMaybe:
      return transactionFormReducer_setFetchWorkerMaybe(state, dispatch);
    case transactionFormActions.setIsLoading:
      return transactionFormReducer_setIsLoading(state, dispatch);
    case transactionFormActions.setMerchant:
      return transactionFormReducer_setMerchant(state, dispatch);
    case transactionFormActions.setNotes:
      return transactionFormReducer_setNotes(state, dispatch);
    case transactionFormActions.setPaymentMethod:
      return transactionFormReducer_setPaymentMethod(state, dispatch);
    case transactionFormActions.setTags:
      return transactionFormReducer_setTags(state, dispatch);
    case transactionFormActions.setType:
      return transactionFormReducer_setType(state, dispatch);
    default:
      return state;
  }
}

function transactionFormReducer_setAmountCents(
  state: TransactionFormState,
  dispatch: SetAmountCentsTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    amountCents: dispatch.payload,
  };
}

function transactionFormReducer_setAppErrorResultMaybe(
  state: TransactionFormState,
  dispatch: SetAppErrorResultMaybeTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    appErrorResultMaybe: dispatch.payload,
  };
}

function transactionFormReducer_setCacheResult(
  state: TransactionFormState,
  dispatch: SetCacheResultTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    cacheResult: dispatch.payload,
  };
}

function transactionFormReducer_setCacheWorkerMaybe(
  state: TransactionFormState,
  dispatch: SetCacheWorkerMaybeTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    cacheWorkerMaybe: dispatch.payload,
  };
}

function transactionFormReducer_setCategory(
  state: TransactionFormState,
  dispatch: SetCategoryTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    category: dispatch.payload,
  };
}

function transactionFormReducer_setDateTime(
  state: TransactionFormState,
  dispatch: SetDateTimeTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    dateTime: dispatch.payload,
  };
}

function transactionFormReducer_setFetchResult(
  state: TransactionFormState,
  dispatch: SetFetchResultTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    fetchResult: dispatch.payload,
  };
}

function transactionFormReducer_setFetchWorkerMaybe(
  state: TransactionFormState,
  dispatch: SetFetchWorkerMaybeTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    fetchWorkerMaybe: dispatch.payload,
  };
}

function transactionFormReducer_setIsLoading(
  state: TransactionFormState,
  dispatch: SetIsLoadingTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    isLoading: dispatch.payload,
  };
}

function transactionFormReducer_setMerchant(
  state: TransactionFormState,
  dispatch: SetMerchantTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    merchant: dispatch.payload,
  };
}

function transactionFormReducer_setNotes(
  state: TransactionFormState,
  dispatch: SetNotesTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    notes: dispatch.payload,
  };
}

function transactionFormReducer_setPaymentMethod(
  state: TransactionFormState,
  dispatch: SetPaymentMethodTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    paymentMethod: dispatch.payload,
  };
}

function transactionFormReducer_setTags(
  state: TransactionFormState,
  dispatch: SetTagsTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    tags: dispatch.payload,
  };
}

function transactionFormReducer_setType(
  state: TransactionFormState,
  dispatch: SetTypeTransactionFormDispatch,
): TransactionFormState {
  return {
    ...state,
    type: dispatch.payload,
  };
}

export {
  transactionFormReducer,
  transactionFormReducer_setAmountCents,
  transactionFormReducer_setAppErrorResultMaybe,
  transactionFormReducer_setCacheResult,
  transactionFormReducer_setCacheWorkerMaybe,
  transactionFormReducer_setCategory,
  transactionFormReducer_setDateTime,
  transactionFormReducer_setFetchResult,
  transactionFormReducer_setFetchWorkerMaybe,
  transactionFormReducer_setIsLoading,
  transactionFormReducer_setMerchant,
  transactionFormReducer_setNotes,
  transactionFormReducer_setPaymentMethod,
  transactionFormReducer_setTags,
  transactionFormReducer_setType,
};
