import { None, type Option } from "ts-results-es";
import type { AppErrorResult } from "../../errors";

type DescendantDispatchTable = Map<
  string,
  {
    descendantAction: string;
    descendantDispatch: React.ActionDispatch<[dispatch: unknown]>;
  }
>;

type GlobalState = {
  appErrorResultMaybe: Option<AppErrorResult>;
};

const initialGlobalState = {
  appErrorResultMaybe: None,
};

export { initialGlobalState };
export type { DescendantDispatchTable, GlobalState };
