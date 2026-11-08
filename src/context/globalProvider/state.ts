import { Err, None, type Option } from "ts-results-es";
import type { AppError } from "../../errors";

type DescendantDispatchTable = Map<
  string,
  {
    descendantAction: string;
    descendantDispatch: React.ActionDispatch<[dispatch: unknown]>;
  }
>;

type GlobalState = {
  safeErrorMaybe: Option<Err<AppError>>;
};

const initialGlobalState = {
  safeErrorMaybe: None,
};

export { initialGlobalState };
export type { DescendantDispatchTable, GlobalState };
