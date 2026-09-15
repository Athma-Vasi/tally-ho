import { Err } from "ts-results-es";
import { z } from "zod";
import { createOptionSchema } from "../../utils";
import { globalActions } from "./actions";

const setCacheWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(globalActions.setCacheWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setDispatchesTableTransactionFormDispatchSchema = z.object({
    action: z.literal(globalActions.setDispatchesTable),
    payload: z.object({
        key: z.string(),
        value: z.any(),
    }),
});

const setForageWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(globalActions.setForageWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setFetchWorkerMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(globalActions.setFetchWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setSafeErrorMaybeTransactionFormDispatchSchema = z.object({
    action: z.literal(globalActions.setSafeErrorMaybe),
    payload: createOptionSchema(z.instanceof(Err)),
});

type TransactionFormDispatch =
    | z.infer<typeof setCacheWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setForageWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setDispatchesTableTransactionFormDispatchSchema>
    | z.infer<typeof setFetchWorkerMaybeTransactionFormDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeTransactionFormDispatchSchema>;

export {
    setCacheWorkerMaybeTransactionFormDispatchSchema,
    setDispatchesTableTransactionFormDispatchSchema,
    setFetchWorkerMaybeTransactionFormDispatchSchema,
    setForageWorkerMaybeTransactionFormDispatchSchema,
    setSafeErrorMaybeTransactionFormDispatchSchema,
};
export type { TransactionFormDispatch };
