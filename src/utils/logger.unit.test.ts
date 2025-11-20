import { logger } from './logger'

describe('logger', () => {
  let consoleDebugSpy: jest.SpyInstance
  let consoleInfoSpy: jest.SpyInstance
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation()
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
      })

      logger.debug({
        source: 'test.ts',
        message: 'Debug message',
        code: 'TEST_CODE',
      })

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)
      const loggedData = JSON.parse(consoleDebugSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('debug')
      expect(loggedData.message).toBe('Debug message')
      expect(loggedData.source).toBe('test.ts')
      expect(loggedData.code).toBe('TEST_CODE')

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
      })
    })

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      })

      logger.debug({
        source: 'test.ts',
        message: 'Debug message',
        code: 'TEST_CODE',
      })

      expect(consoleDebugSpy).not.toHaveBeenCalled()

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
      })
    })
  })

  describe('info', () => {
    it('should log info messages with structured format', () => {
      logger.info({
        source: 'api/test.ts',
        message: 'Info message',
        code: 'INFO_CODE',
        context: { userId: '123' },
      })

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1)
      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('info')
      expect(loggedData.message).toBe('Info message')
      expect(loggedData.source).toBe('api/test.ts')
      expect(loggedData.code).toBe('INFO_CODE')
      expect(loggedData.context).toEqual({ userId: '123' })
      expect(loggedData.timestamp).toBeDefined()
      expect(loggedData.environment).toBeDefined()
    })
  })

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn({
        source: 'components/test.tsx',
        message: 'Warning message',
        code: 'WARN_CODE',
      })

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      const loggedData = JSON.parse(consoleWarnSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('warn')
      expect(loggedData.message).toBe('Warning message')
    })
  })

  describe('error', () => {
    it('should log error messages with error object', () => {
      const testError = new Error('Test error')

      logger.error({
        source: 'api/error.ts',
        message: 'Error occurred',
        code: 'ERROR_CODE',
        error: testError,
      })

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.level).toBe('error')
      expect(loggedData.message).toBe('Error occurred')
      expect(loggedData.code).toBe('ERROR_CODE')
      expect(loggedData.stack).toBeDefined()
      expect(loggedData.errorName).toBe('Error')
    })

    it('should log errors without error object', () => {
      logger.error({
        source: 'api/error.ts',
        message: 'Error without exception',
        code: 'ERROR_CODE',
      })

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.stack).toBeUndefined()
      expect(loggedData.errorName).toBeUndefined()
    })
  })

  describe('sensitive data sanitization', () => {
    it('should redact password fields', () => {
      logger.error({
        source: 'auth/login.ts',
        message: 'Login failed',
        code: 'AUTH_ERROR',
        context: {
          email: 'user@example.com',
          password: 'secret123',
        },
      })

      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.context.email).toBe('user@example.com')
      expect(loggedData.context.password).toBe('[REDACTED]')
    })

    it('should redact token fields', () => {
      logger.info({
        source: 'api/request.ts',
        message: 'API request',
        code: 'REQUEST',
        context: {
          userId: '123',
          authToken: 'abc123',
          apiKey: 'key123',
        },
      })

      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      expect(loggedData.context.userId).toBe('123')
      expect(loggedData.context.authToken).toBe('[REDACTED]')
      expect(loggedData.context.apiKey).toBe('[REDACTED]')
    })

    it('should redact nested sensitive fields', () => {
      logger.error({
        source: 'api/user.ts',
        message: 'User update failed',
        code: 'UPDATE_ERROR',
        context: {
          user: {
            id: '123',
            email: 'user@example.com',
            credentials: {
              password: 'secret',
              token: 'abc123',
            },
          },
        },
      })

      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData.context.user.id).toBe('123')
      expect(loggedData.context.user.email).toBe('user@example.com')
      expect(loggedData.context.user.credentials).toBeDefined()
      expect(loggedData.context.user.credentials.password).toBe('[REDACTED]')
      expect(loggedData.context.user.credentials.token).toBe('[REDACTED]')
    })

    it('should handle various sensitive key formats', () => {
      logger.info({
        source: 'test.ts',
        message: 'Test',
        code: 'TEST',
        context: {
          api_key: 'key1',
          sessionId: 'session1',
          bearerToken: 'bearer1',
          jwtToken: 'jwt1',
        },
      })

      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      expect(loggedData.context.api_key).toBe('[REDACTED]')
      expect(loggedData.context.sessionId).toBe('[REDACTED]')
      expect(loggedData.context.bearerToken).toBe('[REDACTED]')
      expect(loggedData.context.jwtToken).toBe('[REDACTED]')
    })
  })

  describe('structured output format', () => {
    it('should include all required fields', () => {
      logger.error({
        source: 'test.ts',
        message: 'Test message',
        code: 'TEST_CODE',
      })

      const loggedData = JSON.parse(consoleErrorSpy.mock.calls[0][0])
      expect(loggedData).toHaveProperty('timestamp')
      expect(loggedData).toHaveProperty('level')
      expect(loggedData).toHaveProperty('source')
      expect(loggedData).toHaveProperty('message')
      expect(loggedData).toHaveProperty('code')
      expect(loggedData).toHaveProperty('environment')
    })

    it('should use ISO timestamp format', () => {
      logger.info({
        source: 'test.ts',
        message: 'Test',
        code: 'TEST',
      })

      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      const timestamp = new Date(loggedData.timestamp)
      expect(timestamp.toISOString()).toBe(loggedData.timestamp)
    })
  })

  describe('context handling', () => {
    it('should include context when provided', () => {
      logger.info({
        source: 'test.ts',
        message: 'Test',
        code: 'TEST',
        context: {
          userId: '123',
          action: 'create',
          data: { name: 'Test' },
        },
      })

      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      expect(loggedData.context).toEqual({
        userId: '123',
        action: 'create',
        data: { name: 'Test' },
      })
    })

    it('should omit context when not provided', () => {
      logger.info({
        source: 'test.ts',
        message: 'Test',
        code: 'TEST',
      })

      const loggedData = JSON.parse(consoleInfoSpy.mock.calls[0][0])
      expect(loggedData.context).toBeUndefined()
    })
  })
})

