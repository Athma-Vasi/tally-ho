import { Err } from "ts-results-es";
import { z } from "zod";
import { createOptionSchema } from "../../../utils";
import { transactionFormActions } from "./actions";

const setForageWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setForageWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setCacheWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setCacheWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setFetchWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setFetchWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setIsLoadingTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setIsLoading),
    payload: z.boolean(),
});

const response_data_schema = z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
});
const setResponseDataMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setResponseDataMaybe),
    payload: createOptionSchema(z.array(response_data_schema)),
});

const setSafeErrorMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setSafeErrorMaybe),
    payload: createOptionSchema(z.instanceof(Err)),
});

type TransactionFormDispatch =
    | z.infer<typeof setForageWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setCacheWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setFetchWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setIsLoadingTransactionFormDispatchSchema>
    | z.infer<typeof setResponseDataMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeTransactionFormDispatchSchema>;

export {
    response_data_schema,
    setCacheWorkerMaybeTransactionFormDispatchSchema,
    setFetchWorkerMaybeTransactionFormDispatchSchema,
    setForageWorkerMaybeTransactionFormDispatchSchema,
    setIsLoadingTransactionFormDispatchSchema,
    setResponseDataMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
};
export type { TransactionFormDispatch };
