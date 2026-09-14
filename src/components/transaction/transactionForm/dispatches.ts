import { Err } from "ts-results-es";
import { z } from "zod";
import { createOptionSchema } from "../../../utils";
import { transactionFormActions } from "./actions";

const setAmountCentsTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setAmountCents),
    payload: z.number(),
});

const setCategoryTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setCategory),
    payload: z.string(),
});

const setDateTimeTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setDateTime),
    payload: z.string(),
});

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

const setMerchantTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setMerchant),
    payload: z.string(),
});

const setNotesTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setNotes),
    payload: z.string(),
});

const setPaymentMethodTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setPaymentMethod),
    payload: z.string(),
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

const setTagsTransactionFormDispatchSchema = z.object({
    action: z.literal(transactionFormActions.setTags),
    payload: createOptionSchema(z.array(z.string())),
});

type TransactionFormDispatch =
    | z.infer<typeof setAmountCentsTransactionFormDispatchSchema>
    | z.infer<typeof setCategoryTransactionFormDispatchSchema>
    | z.infer<typeof setDateTimeTransactionFormDispatchSchema>
    | z.infer<typeof setForageWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setCacheWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setFetchWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setIsLoadingTransactionFormDispatchSchema>
    | z.infer<typeof setMerchantTransactionFormDispatchSchema>
    | z.infer<typeof setNotesTransactionFormDispatchSchema>
    | z.infer<typeof setPaymentMethodTransactionFormDispatchSchema>
    | z.infer<typeof setResponseDataMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setTagsTransactionFormDispatchSchema>;

export {
    response_data_schema,
    setAmountCentsTransactionFormDispatchSchema,
    setCacheWorkerMaybeTransactionFormDispatchSchema,
    setCategoryTransactionFormDispatchSchema,
    setDateTimeTransactionFormDispatchSchema,
    setFetchWorkerMaybeTransactionFormDispatchSchema,
    setForageWorkerMaybeTransactionFormDispatchSchema,
    setIsLoadingTransactionFormDispatchSchema,
    setMerchantTransactionFormDispatchSchema,
    setNotesTransactionFormDispatchSchema,
    setPaymentMethodTransactionFormDispatchSchema,
    setResponseDataMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
    setTagsTransactionFormDispatchSchema,
};
export type { TransactionFormDispatch };
