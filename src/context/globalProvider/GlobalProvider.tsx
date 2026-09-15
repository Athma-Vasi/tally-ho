import { createContext, useEffect, useMemo, useReducer } from "react";

import { useMountedRef } from "../../hooks/useMountedRef";
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

    const {
        cacheWorkerMaybe,
        dispatchesTable,
        fetchWorkerMaybe,
        forageWorkerMaybe,
        safeErrorMaybe,
    } = globalState;

    const isComponentMountedRef = useMountedRef();

    useEffect(() => {
        if (
            forageWorkerMaybe.isSome() || cacheWorkerMaybe.isSome() ||
            fetchWorkerMaybe.isSome()
        ) {
            return;
        }

        // initialize, add to state, and setup listeners for workers

        const forageWorker = new ForageWorker();
        registerDispatch({
            action: registerActions.setForageWorkerMaybe,
            payload: Some(forageWorker),
        });
        forageWorker.onmessage = async (
            event: MessageEventForageWorkerToMain,
        ) => {
            await handleMessageFromForageWorker(
                {
                    errorDispatch,
                    event,
                    isComponentMountedRef,
                    registerDispatch,
                },
            );
        };

        const cacheWorker = new CacheWorker();
        registerDispatch({
            action: registerActions.setCacheWorkerMaybe,
            payload: Some(cacheWorker),
        });
        cacheWorker.onmessage = async (
            event: MessageEventCacheWorkerToMain,
        ) => {
            await handleMessageFromCacheWorker(
                {
                    errorDispatch,
                    event,
                    isComponentMountedRef,
                    registerDispatch,
                },
            );
        };

        const fetchWorker = new FetchWorker();
        registerDispatch({
            action: registerActions.setFetchWorkerMaybe,
            payload: Some(fetchWorker),
        });
        fetchWorker.onmessage = async (
            event: MessageEventFetchWorkerToMain,
        ) => {
            await handleMessageFromFetchWorker(
                {
                    errorDispatch,
                    event,
                    isComponentMountedRef,
                    registerDispatch,
                },
            );
        };

        // cleanup function to terminate workers on unmount
        return () => {
            forageWorker.terminate();
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
