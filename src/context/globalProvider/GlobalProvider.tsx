import { createContext, useMemo, useReducer } from "react";
import type { ErrorDispatch } from "../../components/error/dispatches";
import type { GlobalDispatch } from "./dispatches";
import { globalReducer } from "./reducers";
import { type GlobalState, initialGlobalState } from "./state";

const GlobalContext = createContext<{
  globalState: GlobalState;
  globalDispatch: React.Dispatch<GlobalDispatch>;
}>({
  globalState: initialGlobalState,
  globalDispatch: () => null,
});

type GlobalProviderProps = {
  childComponentState: GlobalState;
  children: React.ReactNode;
  errorDispatch?: React.Dispatch<ErrorDispatch>;
};

function GlobalProvider({
  childComponentState: backupStateFromErrorHOC,
  children,
}: GlobalProviderProps) {
  console.group("GlobalProvider initialization");
  console.log("Backup state from error HOC:", backupStateFromErrorHOC);
  console.groupEnd();

  const [globalState, globalDispatch] = useReducer(
    globalReducer,
    backupStateFromErrorHOC ?? initialGlobalState,
  );

  const globalContextValue = useMemo(
    () => ({
      globalState,
      globalDispatch,
    }),
    [globalState, globalDispatch],
  );

  console.group("Global context value");
  console.log("Global context value:", globalContextValue);
  console.groupEnd();

  return (
    <GlobalContext.Provider value={globalContextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
