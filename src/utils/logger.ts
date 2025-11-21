type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogParams {
  source: string
  message: string
  code: string
  context?: Record<string, any>
  error?: unknown
}

interface StructuredLog {
  timestamp: string
  level: LogLevel
  source: string
  message: string
  code: string
  context?: Record<string, any>
  stack?: string
  errorName?: string
  environment: string
}

// Sensitive field names to redact
const SENSITIVE_KEYS = [
  'password',
  'token',
  'apikey',
  'api_key',
  'secret',
  'authorization',
  'cookie',
  'jwt',
  'sessionid',
  'session_id',
  'bearer',
]

/**
 * Sanitizes context object by redacting sensitive fields
 */
function sanitizeContext(context: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = SENSITIVE_KEYS.some((sensitiveKey) =>
      lowerKey.includes(sensitiveKey),
    )

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    } else if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Error)
    ) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeContext(value as Record<string, any>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Determines if a log level should be logged based on environment
 */
function shouldLog(level: LogLevel): boolean {
  // In production, skip debug logs
  if (process.env.NODE_ENV === 'production' && level === 'debug') {
    return false
  }
  return true
}

/**
 * Creates a structured log object
 */
function createStructuredLog(
  level: LogLevel,
  params: LogParams,
): StructuredLog {
  const { source, message, code, context, error } = params

  const log: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    source,
    message,
    code,
    environment: process.env.NODE_ENV || 'development',
  }

  // Add sanitized context if provided
  if (context) {
    log.context = sanitizeContext(context)
  }

  // Add error details if provided
  if (error instanceof Error) {
    log.stack = error.stack
    log.errorName = error.name
  }

  return log
}

/**
 * Logs a structured message at the specified level
 */
function log(level: LogLevel, params: LogParams): void {
  if (!shouldLog(level)) {
    return
  }

  const structuredLog = createStructuredLog(level, params)
  const logString = JSON.stringify(structuredLog)

  // Use appropriate console method
  // Vercel automatically captures these
  switch (level) {
    case 'debug':
      console.debug(logString)
      break
    case 'info':
      console.info(logString)
      break
    case 'warn':
      console.warn(logString)
      break
    case 'error':
      console.error(logString)
      break
  }
}

/**
 * Logger utility for structured logging
 * Automatically sanitizes sensitive data and formats for Vercel
 */
export const logger = {
  /**
   * Log debug information (development only)
   */
  debug(params: LogParams): void {
    log('debug', params)
  },

  /**
   * Log general information
   */
  info(params: LogParams): void {
    log('info', params)
  },

  /**
   * Log warnings
   */
  warn(params: LogParams): void {
    log('warn', params)
  },

  /**
   * Log errors
   */
  error(params: LogParams): void {
    log('error', params)
  },
}

// Export types for use in other files
export type { LogParams, LogLevel }
