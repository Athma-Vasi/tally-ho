import { None } from "ts-results-es";
import { fetch_timeout_ms } from "../../constants";
import {
    PromiseRejectionError,
    WorkerError,
    WorkerMessageError,
} from "../../errors";
import type { AppResult } from "../../types";
import {
    createErrorResult,
    createSuccessResult,
    postMessageToMainThread,
    retryFetchSafe,
} from "../../utils";

type WorkerToMainParcel<
    Data = unknown,
> = {
    descendantId: string;
    dataResult: AppResult<Data>;
};

type MessageEventFetchWorkerToMain<
    Data = unknown,
> = MessageEvent<WorkerToMainParcel<Data>>;

type MessageEventMainToFetchWorker = MessageEvent<{
    descendantId: string;
    url: string;
    requestInit: RequestInit;
}>;

{ // block scope for persistent worker state
    type FetchWorkerState = {
        queue: MessageEventMainToFetchWorker[];
        isProcessing: boolean;
    };

    const state: FetchWorkerState = {
        queue: [],
        isProcessing: false,
    };

    async function processMessageEvent(
        event: MessageEventMainToFetchWorker,
    ): Promise<None> {
        if (!event.data) {
            postMessageToMainThread(
                {
                    message: {
                        descendantId: "",
                        dataResult: createErrorResult(
                            new WorkerMessageError(
                                "No data received in fetch worker message",
                            ),
                        ),
                    },
                    self,
                },
            );
            return None;
        }

        const { abort, signal } = new AbortController();
        const timeout = setTimeout(() => {
            abort();
        }, fetch_timeout_ms);

        try {
            const { descendantId, url, requestInit } = event.data;
            const responseResult = await retryFetchSafe(
                {
                    requestInit,
                    signal,
                    url,
                },
            );

            if (responseResult.isErr()) {
                postMessageToMainThread(
                    {
                        message: {
                            descendantId: event.data.descendantId,
                            dataResult: responseResult,
                        },
                        self,
                    },
                );
                return None;
            }

            const responseMaybe = responseResult.unwrap();
            if (responseMaybe.isNone()) {
                postMessageToMainThread(
                    {
                        message: {
                            descendantId: event.data.descendantId,
                            dataResult: createErrorResult(
                                new WorkerMessageError(
                                    "Fetch worker returned None",
                                ),
                            ),
                        },
                        self,
                    },
                );
                return None;
            }

            postMessageToMainThread(
                {
                    message: {
                        descendantId: event.data.descendantId,
                        dataResult: createSuccessResult(
                            responseMaybe.unwrap(),
                        ),
                    },
                    self,
                },
            );
            return None;
        } catch (error: unknown) {
            postMessageToMainThread(
                {
                    message: {
                        descendantId: "",
                        dataResult: createErrorResult(
                            new WorkerError(
                                error,
                            ),
                        ),
                    },
                    self,
                },
            );
            return None;
        } finally {
            clearTimeout(timeout);
        }
    }

    async function handleWorkerMessageEvent(
        event: MessageEventMainToFetchWorker,
    ): Promise<None> {
        state.queue.push(event);

        if (state.isProcessing) {
            return None;
        }

        state.isProcessing = true;

        try {
            while (state.queue.length > 0) {
                const currentEvent = state.queue.shift();

                if (!currentEvent) {
                    continue;
                }

                await processMessageEvent(currentEvent);
            }

            return None;
        } catch (error: unknown) {
            postMessageToMainThread(
                {
                    message: {
                        descendantId: "",
                        dataResult: createErrorResult(
                            new WorkerError(error),
                        ),
                    },
                    self,
                },
            );
            return None;
        } finally {
            state.isProcessing = false;
        }
    }

    async function handleWorkerMessageError(
        event: string | Event,
    ): Promise<None> {
        console.error("Unhandled error in fetch worker:", event);

        postMessageToMainThread(
            {
                message: {
                    descendantId: "",
                    dataResult: createErrorResult(
                        new WorkerError(
                            event,
                            "Unhandled error in fetch worker",
                        ),
                    ),
                },
                self,
            },
        );
        return None;
    }

    async function handleWorkerPromiseRejection(
        event: PromiseRejectionEvent,
    ): Promise<None> {
        console.error(
            "Unhandled promise rejection in fetch worker:",
            event.reason,
        );

        postMessageToMainThread(
            {
                message: {
                    descendantId: "",
                    dataResult: createErrorResult(
                        new PromiseRejectionError(
                            event.reason,
                            "Unhandled promise rejection in fetch worker",
                        ),
                    ),
                },
                self,
            },
        );
        return None;
    }

    self.onmessage = handleWorkerMessageEvent;
    self.onerror = handleWorkerMessageError;

    self.addEventListener(
        "unhandledrejection",
        handleWorkerPromiseRejection,
    );
}

export type { MessageEventFetchWorkerToMain, MessageEventMainToFetchWorker };
