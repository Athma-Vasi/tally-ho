import { createContext, useEffect, useMemo, useReducer } from "react";

import { Some } from "ts-results-es";
import { useMountedRef } from "../../hooks/useMountedRef";
import CacheWorker from "../../workers/cacheWorker?worker";
import FetchWorker from "../../workers/fetchWorker?worker";
import { globalActions } from "./actions";
import type { MessageEventCacheWorkerToMain } from "./cacheWorker";
import type { GlobalDispatch } from "./dispatches";
import type { MessageEventFetchWorkerToMain } from "./fetchWorker";
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

    const {
        cacheWorkerMaybe,
        dispatchesTable,
        fetchWorkerMaybe,
        safeErrorMaybe,
    } = globalState;

    const isComponentMountedRef = useMountedRef();

    useEffect(() => {
        if (
            cacheWorkerMaybe.isSome() ||
            fetchWorkerMaybe.isSome()
        ) {
            return;
        }

        // initialize, add to state, and setup listeners for workers

        const cacheWorker = new CacheWorker();
        globalDispatch({
            action: globalActions.setCacheWorkerMaybe,
            payload: Some(cacheWorker) as any,
        });
        cacheWorker.onmessage = async (
            event: MessageEventCacheWorkerToMain,
        ) => {
        };

        const fetchWorker = new FetchWorker();
        globalDispatch({
            action: globalActions.setFetchWorkerMaybe,
            payload: Some(fetchWorker) as any,
        });
        fetchWorker.onmessage = async (
            event: MessageEventFetchWorkerToMain,
        ) => {
        };

        // cleanup function to terminate workers on unmount
        return () => {
            cacheWorker.terminate();
            fetchWorker.terminate();
            isComponentMountedRef.current = false;
        };
    }, []);

    return (
        <GlobalContext.Provider value={globalContextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };
