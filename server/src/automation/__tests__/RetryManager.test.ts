// NOTE: RetryManager will be imported dynamically in beforeEach after RateLimiter singleton reset
// Only import types and test utilities at the top level
import { AutomationError, ErrorType } from '../utils/errors';
// logger is only needed for mocks, so can stay
import { logger } from '../utils/logger';

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  }
}));

describe('RetryManager', () => {
  let RetryManagerClass: any;
  let retryManager: any; // Will be assigned after dynamic import

  beforeEach(() => {
    // Robustly reset the RateLimiter singleton for test isolation
    const { RateLimiter } = require('../utils/RateLimiter');
    // Robust singleton reset for tests
    RateLimiter._resetInstanceForTests();
    // Use a fully explicit config object
    // Inline config object directly to avoid mutation/shadowing
    RateLimiter.getInstance({
      maxRequestsPerMinute: 30,
      maxRequestsPerHour: 300,
      maxConcurrentRequests: 5,
      cooldownPeriod: 2000
    })._reset();
    // Debug log after getInstance
    // eslint-disable-next-line no-console
    console.log('[TEST] RateLimiter singleton after getInstance:', RateLimiter.getInstance());
    jest.clearAllMocks();
    // Dynamic import after singleton is ready
    const { RetryManager } = require('../utils/RetryManager');
    RetryManagerClass = RetryManager;
    retryManager = new RetryManagerClass({
      maxAttempts: 3,
      initialDelay: 100,
      maxDelay: 1000,
      backoffFactor: 2
    });
  });

  it('should successfully execute an operation that succeeds', async () => {
    console.log('[TEST] should execute the operation successfully without retries');
    const operation = jest.fn().mockResolvedValue('success');
    try {
      const result = await retryManager.executeWithBackoff(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
      expect(logger.warn).not.toHaveBeenCalled();
      expect(logger.error).not.toHaveBeenCalled();
    } catch (err) {
      console.error('[ERROR] Test failed:', err);
      throw err;
    }
  });

  it('should retry on retryable errors and eventually succeed', async () => {
    console.log('[TEST] should retry the operation on retryable errors and eventually succeed');
    const operation = jest.fn()
      .mockRejectedValueOnce(new AutomationError('Network error', ErrorType.NETWORK))
      .mockResolvedValueOnce('success');

    try {
      const result = await retryManager.executeWithBackoff(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.error).not.toHaveBeenCalled();
    } catch (err) {
      console.error('[ERROR] Test failed:', err);
      throw err;
    }
  });

  it('should throw immediately on non-retryable errors', async () => {
    console.log('[TEST] should throw the error if maxAttempts is reached');
    const error = new AutomationError('Auth failed', ErrorType.AUTH_FAILED);
    const operation = jest.fn().mockRejectedValue(error);

    try {
      await expect(retryManager.executeWithBackoff(operation)).rejects.toThrow('Auth failed');
      expect(operation).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.warn).not.toHaveBeenCalled();
    } catch (err) {
      console.error('[ERROR] Test failed:', err);
      throw err;
    }
  });

  it('should respect max attempts and throw after all retries fail', async () => {
    console.log('[TEST] should respect max attempts and throw after all retries fail');
    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    try {
      await expect(retryManager.executeWithBackoff(operation))
        .rejects
        .toThrow('Operation failed after 3 attempts');
      expect(operation).toHaveBeenCalledTimes(3);
      expect(logger.warn).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledTimes(1);
    } catch (err) {
      console.error('[ERROR] Test failed:', err);
      throw err;
    }
  });

  it('should use exponential backoff for delays', async () => {
    jest.useRealTimers();
    console.log('[TEST] should use exponential backoff for delays');

    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    const promise = retryManager.executeWithBackoff(operation);
    await expect(promise).rejects.toThrow('Operation failed after 3 attempts');
  }, 15000);

  it('should respect maxDelay limit', async () => {
    jest.useRealTimers();
    console.log('[TEST] should respect maxDelay limit');
    const retryManager = new RetryManagerClass({
      maxAttempts: 4,
      initialDelay: 500,
      maxDelay: 1000,
      backoffFactor: 3
    });

    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    const promise = retryManager.executeWithBackoff(operation);
    await expect(promise).rejects.toThrow('Operation failed after 4 attempts');
  }, 15000);
});
