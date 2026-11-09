import { None, type Option } from "ts-results-es";
import type { AppErrorResult } from "../../errors";

type GlobalState = {
  appErrorResultMaybe: Option<AppErrorResult>;
};

const initialGlobalState = {
  appErrorResultMaybe: None,
};

export { initialGlobalState };
export type { GlobalState };
