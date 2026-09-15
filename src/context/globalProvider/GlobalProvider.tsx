import { createContext, useMemo, useReducer } from "react";

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
    children: React.ReactNode;
};

function GlobalProvider({ children }: GlobalProviderProps) {
    const [globalState, globalDispatch] = useReducer(
        globalReducer,
        initialGlobalState,
    );

    const globalContextValue = useMemo(
        () => ({
            globalState,
            globalDispatch,
        }),
        [globalState, globalDispatch],
    );

    return (
        <GlobalContext.Provider value={globalContextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };
