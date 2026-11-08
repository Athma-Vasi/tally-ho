import { z } from "zod";
import { createOptionSchema } from "../../utils";
import { globalActions } from "./actions";

const setSafeErrorMaybeGlobalDispatchSchema = z.object({
  action: z.literal(globalActions.setSafeErrorMaybe),
  payload: createOptionSchema(z.any()),
});

type GlobalDispatch = z.infer<typeof setSafeErrorMaybeGlobalDispatchSchema>;

export { setSafeErrorMaybeGlobalDispatchSchema };
export type { GlobalDispatch };
