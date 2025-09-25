// Centralized error logging utility

export interface ErrorContext {
  context: string;
  params?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
}

export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

export function logError(
  error: Error | string,
  context: ErrorContext,
  level: LogLevel = LogLevel.ERROR
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;

  const logEntry = {
    level,
    timestamp,
    context: context.context,
    message: errorMessage,
    params: context.params,
    userId: context.userId,
    requestId: context.requestId,
    stack,
  };

  // In development, log to console with formatting
  if (process.env.NODE_ENV === "development") {
    console.error(`[${level}] ${context.context}:`, {
      message: errorMessage,
      params: context.params,
      timestamp,
      ...(stack && { stack }),
    });
  } else {
    // In production, you might want to send to a logging service
    // For now, we'll use structured console logging
    console.error(JSON.stringify(logEntry));
  }
}

export function logApiError(
  error: Error | string,
  endpoint: string,
  params?: Record<string, unknown>,
  statusCode?: number
): void {
  logError(error, {
    context: `API_${endpoint}`,
    params: {
      ...params,
      statusCode,
    },
  });
}

export function logDataFetchError(
  error: Error | string,
  dataType: string,
  identifier?: string,
  params?: Record<string, unknown>
): void {
  logError(error, {
    context: `DATA_FETCH_${dataType.toUpperCase()}`,
    params: {
      identifier,
      ...params,
    },
  });
}

export function log404Error(
  resourceType: string,
  identifier: string,
  params?: Record<string, unknown>
): void {
  logError(
    `${resourceType} not found: ${identifier}`,
    {
      context: `404_${resourceType.toUpperCase()}`,
      params: {
        identifier,
        ...params,
      },
    },
    LogLevel.WARN
  );
}

export function logNetworkError(
  error: Error | string,
  url: string,
  params?: Record<string, unknown>
): void {
  logError(error, {
    context: "NETWORK_ERROR",
    params: {
      url,
      ...params,
    },
  });
}
