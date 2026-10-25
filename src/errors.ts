function getErrorName(error: unknown): string {
  if (error === null) {
    return "Erorr was null.";
  }

  if (error === undefined) {
    return "Error was undefined.";
  }

  if (error instanceof Error) {
    return String(error?.name ?? "Error name was null or undefined.");
  }

  return "Error name not available.";
}

function getErrorStack(error: unknown): string {
  if (error === null) {
    return "Error was null.";
  }

  if (error === undefined) {
    return "Error was undefined.";
  }

  if (error instanceof Error) {
    return String(error?.stack ?? "Stack is null or undefined.");
  }

  return "Stack trace not available.";
}

type AppError = {
  name: string;
  kind: AppErrorKind;
  stack: string;
  message: string;
  timestamp: string;
};

function createAppError(error: unknown, message: string, kind: AppErrorKind): AppError {
  const appError: AppError = {
    name: getErrorName(error),
    kind,
    stack: getErrorStack(error),
    message,
    timestamp: new Date().toISOString(),
  };

  return appError;
}

function createAuthError(error?: unknown, message = "Authentication error occurred"): AppError {
  const authError: AppError = createAppError(error, message, "AuthError");

  return authError;
}

function createValidationError(error?: unknown, message = "Validation error occurred"): AppError {
  const validationError: AppError = createAppError(error, message, "ValidationError");

  return validationError;
}

function createDatabaseError(error?: unknown, message = "Database error occurred"): AppError {
  const databaseError: AppError = createAppError(error, message, "DatabaseError");

  return databaseError;
}

function createNotFoundError(error?: unknown, message = "Resource not found"): AppError {
  const notFoundError: AppError = createAppError(error, message, "NotFoundError");

  return notFoundError;
}

function createNetworkError(
  error?: unknown,
  status: number = 503,
  message = "Network error occurred",
): AppError {
  const http_status_codes: Record<number, string> = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    103: "Early Hints",

    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",

    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found (Temporary Redirect)",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    306: "Switch Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",

    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    419: "Page Expired",
    420: "Enhance Your Calm",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    440: "Login Time-out",
    444: "No Response",
    449: "Retry With",
    451: "Unavailable For Legal Reasons",
    460: "Client Closed Connection",
    463: "X-Forwarded-For Too Large",
    499: "Client Closed Request",

    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    520: "Web Server Returned an Unknown Error",
    521: "Web Server Is Down",
    522: "Connection Timed Out",
    523: "Origin Is Unreachable",
    524: "A Timeout Occurred",
    525: "SSL Handshake Failed",
    526: "Invalid SSL Certificate",
    529: "Site is Overloaded",
    530: "Site is Frozen",
    561: "Unauthorized",
    598: "Network Read Timeout Error",
    599: "Network Connect Timeout Error",
  };

  const networkError: AppError = {
    name: http_status_codes[status]?.[0] ?? "Unknown Error",
    kind: "NetworkError",
    stack: getErrorStack(error),
    message,
    timestamp: new Date().toISOString(),
  };

  return networkError;
}

function createTokenCreationError(
  error?: unknown,
  message = "Token creation error occurred",
): AppError {
  const tokenCreationError: AppError = createAppError(error, message, "TokenCreationError");

  return tokenCreationError;
}

function createTokenDecodeError(
  error?: unknown,
  message = "Token decoding error occurred",
): AppError {
  const tokenDecodeError: AppError = createAppError(error, message, "TokenDecodeError");

  return tokenDecodeError;
}

function createTokenVerificationError(
  error?: unknown,
  message = "Token verification error occurred",
): AppError {
  const tokenVerificationError: AppError = createAppError(error, message, "TokenVerificationError");

  return tokenVerificationError;
}

function createTokenSignatureError(
  error?: unknown,
  message = "Token signature error occurred",
): AppError {
  const tokenSignatureError: AppError = createAppError(error, message, "TokenSignatureError");

  return tokenSignatureError;
}

function createTimeoutError(error?: unknown, message = "Operation timed out"): AppError {
  const timeoutError: AppError = createAppError(error, message, "TimeoutError");

  return timeoutError;
}

function createPromiseRejectionError(
  error?: unknown,
  message = "Unhandled promise rejection",
): AppError {
  const promiseRejectionError: AppError = createAppError(error, message, "PromiseRejectionError");

  return promiseRejectionError;
}

function createPromiseAbortedError(error?: unknown, message = "Promise was aborted"): AppError {
  const promiseAbortedError: AppError = createAppError(error, message, "PromiseAbortedError");

  return promiseAbortedError;
}

function createRetryLimitExceededError(
  error?: unknown,
  message = "Retry limit exceeded",
): AppError {
  const retryLimitExceededError: AppError = createAppError(
    error,
    message,
    "RetryLimitExceededError",
  );

  return retryLimitExceededError;
}

function createHashComparisonError(
  error?: unknown,
  message = "Hash comparison error occurred",
): AppError {
  const hashComparisonError: AppError = createAppError(error, message, "HashComparisonError");

  return hashComparisonError;
}

function createHashGenerationError(
  error?: unknown,
  message = "Hash generation error occurred",
): AppError {
  const hashGenerationError: AppError = createAppError(error, message, "HashGenerationError");

  return hashGenerationError;
}

function createAbortError(error?: unknown, message = "Operation was aborted"): AppError {
  const abortError: AppError = createAppError(error, message, "AbortError");

  return abortError;
}

function createCacheError(error?: unknown, message = "Cache error occurred"): AppError {
  const cacheError: AppError = createAppError(error, message, "CacheError");

  return cacheError;
}

function createJSONError(error?: unknown, message = "JSON error occurred"): AppError {
  const jsonError: AppError = createAppError(error, message, "JSONError");

  return jsonError;
}

function createParseError(error?: unknown, message = "Parse error occurred"): AppError {
  const parseError: AppError = createAppError(error, message, "ParseError");

  return parseError;
}

function createInvariantError(error?: unknown, message = "Invariant error occurred"): AppError {
  const invariantError: AppError = createAppError(error, message, "InvariantError");

  return invariantError;
}

function createHTTPError(error?: unknown, message = "HTTP error occurred"): AppError {
  const httpError: AppError = createAppError(error, message, "HTTPError");

  return httpError;
}

function createUnknownError(error?: unknown, message = "An unknown error occurred"): AppError {
  const unknownError: AppError = createAppError(error, message, "UnknownError");

  return unknownError;
}

function createWorkerError(error?: unknown, message = "Worker error occurred"): AppError {
  const workerError: AppError = createAppError(error, message, "WorkerError");

  return workerError;
}

function createWorkerMessageError(
  error?: unknown,
  message = "Worker message error occurred",
): AppError {
  const workerMessageError: AppError = createAppError(error, message, "WorkerMessageError");

  return workerMessageError;
}

function createWorkerMessageHandlerError(
  error?: unknown,
  message = "Worker message handler error occurred",
): AppError {
  const workerMessageHandlerError: AppError = createAppError(
    error,
    message,
    "WorkerMessageHandlerError",
  );

  return workerMessageHandlerError;
}

type AppErrorKind =
  | "AbortError"
  | "AuthError"
  | "CacheError"
  | "DatabaseError"
  | "HashComparisonError"
  | "HashGenerationError"
  | "HTTPError"
  | "InvariantError"
  | "JSONError"
  | "NotFoundError"
  | "ParseError"
  | "PromiseAbortedError"
  | "PromiseRejectionError"
  | "RetryLimitExceededError"
  | "TimeoutError"
  | "TokenCreationError"
  | "TokenDecodeError"
  | "TokenSignatureError"
  | "TokenVerificationError"
  | "UnknownError"
  | "ValidationError"
  | "WorkerError"
  | "WorkerMessageError"
  | "WorkerMessageHandlerError"
  | "NetworkError";

export type { AppErrorKind };

export {
  createAbortError,
  createAuthError,
  createCacheError,
  createDatabaseError,
  createHashComparisonError,
  createHashGenerationError,
  createHTTPError,
  createInvariantError,
  createJSONError,
  createNetworkError,
  createNotFoundError,
  createParseError,
  createPromiseAbortedError,
  createPromiseRejectionError,
  createRetryLimitExceededError,
  createTimeoutError,
  createTokenCreationError,
  createTokenDecodeError,
  createTokenSignatureError,
  createTokenVerificationError,
  createUnknownError,
  createValidationError,
  createWorkerError,
  createWorkerMessageError,
  createWorkerMessageHandlerError,
};
