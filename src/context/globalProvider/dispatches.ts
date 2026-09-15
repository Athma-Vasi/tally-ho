import { Err } from "ts-results-es";
import { z } from "zod";
import { createOptionSchema } from "../../utils";
import { globalActions } from "./actions";

const setCacheWorkerMaybeGlobalDispatchSchema = z.object({
    action: z.literal(globalActions.setCacheWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setDispatchesTableGlobalDispatchSchema = z.object({
    action: z.literal(globalActions.setDispatchesTable),
    payload: z.object({
        key: z.string(),
        value: z.any(),
    }),
});

const setForageWorkerMaybeGlobalDispatchSchema = z.object({
    action: z.literal(globalActions.setForageWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setFetchWorkerMaybeGlobalDispatchSchema = z.object({
    action: z.literal(globalActions.setFetchWorkerMaybe),
    payload: createOptionSchema(z.instanceof(Worker)),
});

const setSafeErrorMaybeGlobalDispatchSchema = z.object({
    action: z.literal(globalActions.setSafeErrorMaybe),
    payload: createOptionSchema(z.instanceof(Err)),
});

type GlobalDispatch =
    | z.infer<typeof setCacheWorkerMaybeGlobalDispatchSchema>
    | z.infer<typeof setForageWorkerMaybeGlobalDispatchSchema>
    | z.infer<typeof setDispatchesTableGlobalDispatchSchema>
    | z.infer<typeof setFetchWorkerMaybeGlobalDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeGlobalDispatchSchema>;

export {
    setCacheWorkerMaybeGlobalDispatchSchema,
    setDispatchesTableGlobalDispatchSchema,
    setFetchWorkerMaybeGlobalDispatchSchema,
    setForageWorkerMaybeGlobalDispatchSchema,
    setSafeErrorMaybeGlobalDispatchSchema,
};
export type { GlobalDispatch };
