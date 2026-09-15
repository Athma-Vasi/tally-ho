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
    retryFetchSafe,
} from "../../utils";

type MessageEventFetchWorkerToMain<
    Data = unknown,
> = MessageEvent<AppResult<Data>>;

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
            self.postMessage(
                createErrorResult(
                    new WorkerMessageError(
                        "No data received in fetch worker message",
                    ),
                ),
            );
            return None;
        }

        const { abort, signal } = new AbortController();
        const timeout = setTimeout(() => {
            abort();
        }, fetch_timeout_ms);

        try {
            const { descendantId, url, requestInit } = event.data;
            const responseResult = await retryFetchSafe({
                requestInit,
                signal,
                url,
            });

            if (responseResult.isErr()) {
                self.postMessage(responseResult);
                return None;
            }

            const responseMaybe = responseResult.unwrap();
            if (responseMaybe.isNone()) {
                self.postMessage(createSuccessResult(None));
                return None;
            }

            const parcel = {
                descendantId,
                data: responseMaybe.unwrap(),
            };

            self.postMessage(createSuccessResult(parcel));
            return None;
        } catch (error: unknown) {
            self.postMessage(
                createErrorResult(
                    new WorkerError(error),
                ),
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
            self.postMessage(
                createErrorResult(
                    new WorkerError(error),
                ),
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
        self.postMessage(
            createErrorResult(
                new WorkerError(
                    event,
                    "Unhandled error in fetch worker",
                ),
            ),
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
        self.postMessage(
            createErrorResult(
                new PromiseRejectionError(
                    event.reason,
                    "Unhandled promise rejection in fetch worker",
                ),
            ),
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
