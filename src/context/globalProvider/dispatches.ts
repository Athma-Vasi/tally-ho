import { z } from "zod";
import { createOptionSchema } from "../../utils";
import { globalActions } from "./actions";

const setCacheWorkerMaybeGlobalDispatchSchema = z.object(
    {
        action: z.literal(globalActions.setCacheWorkerMaybe),
        payload: createOptionSchema(z.instanceof(Worker)),
    },
);

const setDescendantDispatchTableGlobalDispatchSchema = z.object(
    {
        action: z.literal(globalActions.setDescendantDispatchTable),
        payload: z.object(
            {
                descendantId: z.string(),
                descendantAction: z.string(),
                descendantDispatch: z.function(),
            },
        ),
    },
);

const setFetchWorkerMaybeGlobalDispatchSchema = z.object(
    {
        action: z.literal(globalActions.setFetchWorkerMaybe),
        payload: createOptionSchema(z.instanceof(Worker)),
    },
);

const setSafeErrorMaybeGlobalDispatchSchema = z.object(
    {
        action: z.literal(globalActions.setSafeErrorMaybe),
        payload: createOptionSchema(z.any()),
    },
);

type GlobalDispatch =
    | z.infer<typeof setCacheWorkerMaybeGlobalDispatchSchema>
    | z.infer<typeof setDescendantDispatchTableGlobalDispatchSchema>
    | z.infer<typeof setFetchWorkerMaybeGlobalDispatchSchema>
    | z.infer<typeof setSafeErrorMaybeGlobalDispatchSchema>;

export {
    setCacheWorkerMaybeGlobalDispatchSchema,
    setDescendantDispatchTableGlobalDispatchSchema,
    setFetchWorkerMaybeGlobalDispatchSchema,
    setSafeErrorMaybeGlobalDispatchSchema,
};
export type { GlobalDispatch };
