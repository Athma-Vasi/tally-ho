import { type Err, None, type Option } from "ts-results-es";
import type { AppError, ResponseData } from "../../../types";

type TransactionFormState = {
    // handles caching operations
    cacheWorkerMaybe: Option<Worker>;
    // handles fetch operations
    fetchWorkerMaybe: Option<Worker>;
    // handles all storage operations
    forageWorkerMaybe: Option<Worker>;
    isLoading: boolean;
    responseDataMaybe: Option<Array<ResponseData>>;
    safeErrorMaybe: Option<Err<AppError>>;
};

const initialTransactionFormState: TransactionFormState = {
    cacheWorkerMaybe: None,
    fetchWorkerMaybe: None,
    forageWorkerMaybe: None,
    isLoading: false,
    responseDataMaybe: None,
    safeErrorMaybe: None,
};

export { initialTransactionFormState };
export type { TransactionFormState };
