import { createContext, useEffect, useMemo, useReducer } from "react";
import { Some } from "ts-results-es";
import type { ErrorDispatch } from "../../components/error/dispatches";
import { useMountedRef } from "../../hooks/useMountedRef";
import { globalActions } from "./actions";
import type { MessageEventCacheWorkerToMain } from "./cacheWorker";
import CacheWorker from "./cacheWorker?worker";
import type { GlobalDispatch } from "./dispatches";
import type { MessageEventFetchWorkerToMain } from "./fetchWorker";
import FetchWorker from "./fetchWorker?worker";
import {
    handleMessageFromCacheWorker,
    handleMessageFromFetchWorker,
} from "./handlers";
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
    children?: React.ReactNode;
    errorDispatch: React.Dispatch<ErrorDispatch>;
};

function GlobalProvider(
    { childComponentState: backupStateFromErrorHOC, children, errorDispatch }:
        GlobalProviderProps,
) {
    const [globalState, globalDispatch] = useReducer(
        globalReducer,
        backupStateFromErrorHOC ?? initialGlobalState,
    );

    const {
        cacheWorkerMaybe,
        descendantDispatchTable,
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
        globalDispatch(
            {
                action: globalActions.setCacheWorkerMaybe,
                payload: Some(cacheWorker) as any,
            },
        );
        cacheWorker.onmessage = async (
            event: MessageEventCacheWorkerToMain,
        ) => {
            await handleMessageFromCacheWorker(
                {
                    descendantDispatchTable,
                    errorDispatch,
                    event,
                    isComponentMountedRef,
                    globalDispatch,
                },
            );
        };

        const fetchWorker = new FetchWorker();
        globalDispatch({
            action: globalActions.setFetchWorkerMaybe,
            payload: Some(fetchWorker) as any,
        });
        fetchWorker.onmessage = async (
            event: MessageEventFetchWorkerToMain,
        ) => {
            await handleMessageFromFetchWorker(
                {
                    descendantDispatchTable,
                    errorDispatch,
                    event,
                    isComponentMountedRef,
                    globalDispatch,
                },
            );
        };

        // cleanup function to terminate workers on unmount
        return () => {
            cacheWorker.terminate();
            fetchWorker.terminate();
            isComponentMountedRef.current = false;
        };
    }, []);

    const globalContextValue = useMemo(
        () => (
            {
                globalState,
                globalDispatch,
            }
        ),
        [globalState, globalDispatch],
    );

    return (
        <GlobalContext.Provider value={globalContextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };
