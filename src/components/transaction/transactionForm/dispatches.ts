import { Err } from "ts-results-es";
import { z } from "zod";
import { data_result_schema } from "../../../schemas";
import { createOptionSchema } from "../../../utils";
import { transactionFormActions } from "./actions";

const setAmountCentsTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setAmountCents),
        payload: z.string(),
    },
);

const setCategoryTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setCategory),
        payload: z.string(),
    },
);

const setDataResultMaybeTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setDataResultMaybe),
        payload: createOptionSchema(data_result_schema),
    },
);

const setDateTimeTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setDateTime),
        payload: z.string(),
    },
);

const setDescendantIdTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setDescendantId),
        payload: z.string(),
    },
);

const setIsLoadingTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setIsLoading),
        payload: z.boolean(),
    },
);

const setMerchantTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setMerchant),
        payload: z.string(),
    },
);

const setNotesTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setNotes),
        payload: z.string(),
    },
);

const setPaymentMethodTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setPaymentMethod),
        payload: z.string(),
    },
);

const setSafeErrorMaybeTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setSafeErrorMaybe),
        payload: createOptionSchema(z.instanceof(Err)),
    },
);

const setTagsTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setTags),
        payload: z.string(),
    },
);

const setTypeTransactionFormDispatchSchema = z.object(
    {
        action: z.literal(transactionFormActions.setType),
        payload: z.string(),
    },
);

type TransactionFormDispatch =
    | z.infer<typeof setAmountCentsTransactionFormDispatchSchema>
    | z.infer<typeof setCategoryTransactionFormDispatchSchema>
    | z.infer<typeof setDateTimeTransactionFormDispatchSchema>
    | z.infer<typeof setDescendantIdTransactionFormDispatchSchema>
    | z.infer<typeof setIsLoadingTransactionFormDispatchSchema>
    | z.infer<typeof setMerchantTransactionFormDispatchSchema>
    | z.infer<typeof setNotesTransactionFormDispatchSchema>
    | z.infer<typeof setPaymentMethodTransactionFormDispatchSchema>
    | z.infer<typeof setDataResultMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setTagsTransactionFormDispatchSchema>
    | z.infer<typeof setTypeTransactionFormDispatchSchema>;

export {
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
};
export type { TransactionFormDispatch };
