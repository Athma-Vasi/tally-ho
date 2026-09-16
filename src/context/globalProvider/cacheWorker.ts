import { None } from "ts-results-es";
import { async_timeout_ms } from "../../constants";
import {
    PromiseRejectionError,
    WorkerError,
    WorkerMessageError,
} from "../../errors";
import type { AppResult } from "../../types";
import {
    createErrorResult,
    createSuccessResult,
    getCachedItemAbortableSafe,
    postMessageToMainThread,
    removeCachedItemAbortableSafe,
    setCachedItemAbortableSafe,
} from "../../utils";

type MessageEventCacheWorkerToMain<
    Data = unknown,
> = MessageEvent<{
    descendantId: string;
    dataResult: AppResult<Data>;
}>;

type MessageEventMainToCacheWorker<Key = string, Value = unknown> =
    MessageEvent<
        {
            descendantId: string;
            kind: "get";
            payload: [Key];
        } | {
            descendantId: string;
            kind: "set";
            payload: [Key, Value];
        } | {
            descendantId: string;
            kind: "remove";
            payload: [Key];
        }
    >;

{ // block scope for persistent worker state
    type CacheWorkerState = {
        queue: MessageEventMainToCacheWorker[];
        isProcessing: boolean;
    };

    const state: CacheWorkerState = {
        queue: [],
        isProcessing: false,
    };

    async function processMessageEvent(
        event: MessageEventMainToCacheWorker,
    ): Promise<None> {
        if (!event.data) {
            postMessageToMainThread(
                {
                    message: {
                        descendantId: "",
                        dataResult: createErrorResult(
                            new WorkerMessageError(
                                "No data received in cache worker message",
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
        }, async_timeout_ms);

        try {
            const { descendantId, kind, payload } = event.data;

            switch (kind) {
                case "get": {
                    const [key] = payload;
                    const getResult = await getCachedItemAbortableSafe<
                        unknown
                    >(key, signal);

                    postMessageToMainThread(
                        {
                            message: {
                                descendantId,
                                dataResult: getResult,
                            },
                            self,
                        },
                    );
                    break;
                }

                case "set": {
                    const [key, value] = payload;
                    await setCachedItemAbortableSafe(
                        key,
                        value,
                        signal,
                    );

                    postMessageToMainThread(
                        {
                            message: {
                                descendantId,
                                dataResult: createSuccessResult(None),
                            },
                            self,
                        },
                    );
                    break;
                }

                case "remove": {
                    const [key] = payload;
                    await removeCachedItemAbortableSafe(
                        key,
                        signal,
                    );
                    self.postMessage(
                        {
                            descendantId,
                            dataResult: createSuccessResult(None),
                        },
                    );
                    break;
                }

                default: {
                    postMessageToMainThread(
                        {
                            message: {
                                descendantId,
                                dataResult: createErrorResult(
                                    new WorkerMessageError(
                                        `Unknown message kind: "${
                                            String(kind)
                                        }" received in cache worker`,
                                    ),
                                ),
                            },
                            self,
                        },
                    );
                    break;
                }
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
            clearTimeout(timeout);
        }
    }

    async function handleWorkerMessageEvent(
        event: MessageEventMainToCacheWorker,
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

    async function handleWorkerErrorEvent(
        event: string | Event,
    ): Promise<None> {
        console.error("Unhandled error in cache worker:", event);

        postMessageToMainThread(
            {
                message: {
                    descendantId: "",
                    dataResult: createErrorResult(
                        new WorkerError(
                            event,
                            "Unhandled error in cache worker",
                        ),
                    ),
                },
                self,
            },
        );
        return None;
    }

    async function handlePromiseRejectionEvent(
        event: PromiseRejectionEvent,
    ): Promise<None> {
        console.error(
            "Unhandled promise rejection in cache worker:",
            event.reason,
        );

        postMessageToMainThread(
            {
                message: {
                    descendantId: "",
                    dataResult: createErrorResult(
                        new PromiseRejectionError(
                            event.reason,
                            "Unhandled promise rejection in cache worker",
                        ),
                    ),
                },
                self,
            },
        );

        return None;
    }

    self.onmessage = handleWorkerMessageEvent;
    self.onerror = handleWorkerErrorEvent;

    self.addEventListener(
        "unhandledrejection",
        handlePromiseRejectionEvent,
    );
}

export type { MessageEventCacheWorkerToMain, MessageEventMainToCacheWorker };
