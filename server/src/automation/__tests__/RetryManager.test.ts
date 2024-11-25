import { RetryManager } from '../utils/RetryManager';
import { AutomationError, ErrorType } from '../utils/errors';
import { logger } from '../utils/logger';

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }
}));

describe('RetryManager', () => {
  let retryManager: RetryManager;

  beforeEach(() => {
    jest.clearAllMocks();
    retryManager = new RetryManager({
      maxAttempts: 3,
      initialDelay: 100,
      maxDelay: 1000,
      backoffFactor: 2
    });
  });

  it('should successfully execute an operation that succeeds', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    const result = await retryManager.executeWithBackoff(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should retry on retryable errors and eventually succeed', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new AutomationError('Network error', ErrorType.NETWORK))
      .mockResolvedValueOnce('success');

    const result = await retryManager.executeWithBackoff(operation);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should throw immediately on non-retryable errors', async () => {
    const error = new AutomationError('Auth failed', ErrorType.AUTH_FAILED);
    const operation = jest.fn().mockRejectedValue(error);

    await expect(retryManager.executeWithBackoff(operation))
      .rejects
      .toThrow(error);

    expect(operation).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should respect max attempts and throw after all retries fail', async () => {
    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    await expect(retryManager.executeWithBackoff(operation))
      .rejects
      .toThrow('Operation failed after 3 attempts');

    expect(operation).toHaveBeenCalledTimes(3);
    expect(logger.warn).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('should use exponential backoff for delays', async () => {
    jest.useFakeTimers();

    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    const promise = retryManager.executeWithBackoff(operation);
    
    // First attempt fails immediately
    await jest.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt after initial delay (100ms)
    await jest.advanceTimersByTimeAsync(100);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt after doubled delay (200ms)
    await jest.advanceTimersByTimeAsync(200);
    expect(operation).toHaveBeenCalledTimes(3);

    await expect(promise).rejects.toThrow();
    
    jest.useRealTimers();
  });

  it('should respect maxDelay limit', async () => {
    const retryManager = new RetryManager({
      maxAttempts: 4,
      initialDelay: 500,
      maxDelay: 1000,
      backoffFactor: 3
    });

    const error = new AutomationError('Network error', ErrorType.NETWORK);
    const operation = jest.fn().mockRejectedValue(error);

    jest.useFakeTimers();
    const promise = retryManager.executeWithBackoff(operation);

    // First attempt fails immediately
    await jest.advanceTimersByTimeAsync(0);
    expect(operation).toHaveBeenCalledTimes(1);

    // Second attempt after 500ms
    await jest.advanceTimersByTimeAsync(500);
    expect(operation).toHaveBeenCalledTimes(2);

    // Third attempt after 1000ms (limited by maxDelay)
    await jest.advanceTimersByTimeAsync(1000);
    expect(operation).toHaveBeenCalledTimes(3);

    // Fourth attempt after 1000ms (limited by maxDelay)
    await jest.advanceTimersByTimeAsync(1000);
    expect(operation).toHaveBeenCalledTimes(4);

    await expect(promise).rejects.toThrow();
    
    jest.useRealTimers();
  });
});
