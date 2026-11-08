import { useEffect, useReducer, useRef } from "react";
import { Some } from "ts-results-es";
import { useGlobalState } from "../../../hooks/useGlobalState";
import { useMountedRef } from "../../../hooks/useMountedRef";
import { sendMessageToWorker } from "../../../utils";
import type { MessageEventCacheWorkerToMain } from "../../../workers/cacheWorker";
import CacheWorker from "../../../workers/cacheWorker?worker";
import type {
  MessageEventFetchWorkerToMain,
  MessageEventMainToFetchWorker,
  OrderFromMainToFetchWorker,
} from "../../../workers/fetchWorker";
import FetchWorker from "../../../workers/fetchWorker?worker";
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
import {
  handleMessageFromCacheWorker,
  handleMessageFromFetchWorker,
} from "./handlers";
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

function TransactionForm({
  childComponentState: backupStateFromErrorHOC,
  errorDispatch,
}: TransactionFormProps) {
  const [transactionFormState, transactionFormDispatch] = useReducer(
    transactionFormReducer,
    backupStateFromErrorHOC ?? initialTransactionFormState,
  );
  const {
    amountCents,
    cacheResultMaybe,
    cacheWorkerMaybe,
    category,
    dateTime,
    descendantId,
    fetchResultMaybe,
    fetchWorkerMaybe,
    isLoading,
    merchant,
    notes,
    paymentMethod,
    safeErrorMaybe,
    tags,
    type,
  } = transactionFormState;

  const { globalDispatch, globalState } = useGlobalState();

  const amountCentsInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    amountCentsInputRef.current?.focus?.();
  }, []);

  const isComponentMountedRef = useMountedRef();

  useEffect(() => {
    console.group("Initializing workers");
    console.groupEnd();

    if (cacheWorkerMaybe.isSome() || fetchWorkerMaybe.isSome()) {
      return;
    }

    // initialize, add to state, and setup listeners for workers

    const cacheWorker = new CacheWorker();
    transactionFormDispatch({
      action: transactionFormActions.setCacheWorkerMaybe,
      payload: Some(cacheWorker),
    });
    cacheWorker.onmessage = async (event: MessageEventCacheWorkerToMain) => {
      await handleMessageFromCacheWorker({
        event,
        isComponentMountedRef,
        transactionFormDispatch,
      });
    };

    const fetchWorker = new FetchWorker();
    transactionFormDispatch({
      action: transactionFormActions.setFetchWorkerMaybe,
      payload: Some(fetchWorker) as any,
    });
    fetchWorker.onmessage = async (event: MessageEventFetchWorkerToMain) => {
      console.log("Received message from fetch worker:", event);

      await handleMessageFromFetchWorker({
        event,
        isComponentMountedRef,
        transactionFormDispatch,
      });
    };

    // cleanup function to terminate workers on unmount
    return () => {
      cacheWorker.terminate();
      fetchWorker.terminate();
      isComponentMountedRef.current = false;
    };
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
        const {
          currentTarget: { value },
        } = event;
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
        const {
          currentTarget: { value },
        } = event;
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
        const {
          currentTarget: { value },
        } = event;
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
        const {
          currentTarget: { value },
        } = event;
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
        const {
          currentTarget: { value },
        } = event;
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

  function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event.preventDefault();
    console.log(
      "Submitting transaction form with state:",
      transactionFormState,
    );
    console.log("Global state when submitting transaction form:", globalState);

    const message: OrderFromMainToFetchWorker = {
      descendantId,
      requestInit: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      url: "https://jsonplaceholder.typicode.com/posts/1",
    };

    // send message to worker with unique descendantId
    sendMessageToWorker<MessageEventMainToFetchWorker>({
      actions: transactionFormActions,
      dispatch: transactionFormDispatch,
      message,
      workerMaybe: fetchWorkerMaybe,
    });
  }

  const submitButtonElement = (
    <AccessibleButtonInput
      disabled={isLoading}
      dispatch={transactionFormDispatch}
      isLoading={isLoading}
      kind="submit"
      name="submit"
      onClick={handleSubmit}
      setIsLoadingAction={transactionFormActions.setIsLoading}
      type="submit"
    />
  );

  console.group("TransactionForm Render");
  console.log("transactionFormState", transactionFormState);
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
