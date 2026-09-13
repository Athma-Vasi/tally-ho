import { Err } from "ts-results";
import * as v from "valibot";
import { createOptionSchema } from "../../schemas";
import { transactionFormActions } from "./actions";

const setForageWorkerMaybeTransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setForageWorkerMaybe),
    payload: createOptionSchema(v.instance(Worker)),
});

const setCacheWorkerMaybeTransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setCacheWorkerMaybe),
    payload: createOptionSchema(v.instance(Worker)),
});

const setFetchWorkerMaybeTransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setFetchWorkerMaybe),
    payload: createOptionSchema(v.instance(Worker)),
});

const setIsLoadingtransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setIsLoading),
    payload: v.boolean(),
});

const response_data_schema = v.object({
    body: v.string(),
    id: v.number(),
    title: v.string(),
    userId: v.number(),
});
const setResponseDataMaybeTransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setResponseDataMaybe),
    payload: createOptionSchema(v.array(response_data_schema)),
});

const setSafeErrorMaybeTransactionFormDispatchSchema = v.object({
    action: v.literal(transactionFormActions.setSafeErrorMaybe),
    payload: createOptionSchema(v.instance(Err)),
});

const TransactionFormSchema = v.object({
    setForageWorkerMaybe: setForageWorkerMaybeTransactionFormDispatchSchema,
    setCacheWorkerMaybe: setCacheWorkerMaybeTransactionFormDispatchSchema,
    setFetchWorkerMaybe: setFetchWorkerMaybeTransactionFormDispatchSchema,
    setIsLoading: setIsLoadingtransactionFormDispatchSchema,
    setResponseDataMaybe: setResponseDataMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybe: setSafeErrorMaybeTransactionFormDispatchSchema,
});

type TransactionFormDispatch = v.InferOutput<typeof TransactionFormSchema>;

export {
    response_data_schema,
    setCacheWorkerMaybeTransactionFormDispatchSchema,
    setFetchWorkerMaybeTransactionFormDispatchSchema,
    setForageWorkerMaybeTransactionFormDispatchSchema,
    setIsLoadingtransactionFormDispatchSchema,
    setResponseDataMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
};
export type { TransactionFormDispatch };
