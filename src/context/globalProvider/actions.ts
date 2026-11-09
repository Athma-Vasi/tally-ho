import type { GlobalState } from "./state";

type GlobalActions = {
  [K in keyof GlobalState as `set${Capitalize<string & K>}`]: `set${Capitalize<
    string & K
  >}`;
};

const globalActions: GlobalActions = {
  setAppErrorResultMaybe: "setAppErrorResultMaybe",
};

export { globalActions };
export type { GlobalActions };
