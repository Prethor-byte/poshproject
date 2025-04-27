import { RetryManager } from '../RetryManager';
import { AutomationError, ErrorType } from '../errors';

describe('RetryManager', () => {
  beforeEach(() => {
    const { RateLimiter } = require('../../utils/RateLimiter');
    RateLimiter._resetInstanceForTests?.();
    RateLimiter.getInstance({
      maxRequestsPerMinute: 30,
      maxRequestsPerHour: 300,
      maxConcurrentRequests: 5,
      cooldownPeriod: 2000
    })._reset();
    jest.clearAllMocks();
  });
  afterAll(() => {
    const manager = require('../../utils/BrowserManager').BrowserManager.getInstance();
    manager.stopMonitoring();
  });
  it('retries on retryable error and succeeds', async () => {
    let attempts = 0;
    const manager = new RetryManager({
      maxAttempts: 3,
      initialDelay: 1,
      maxDelay: 10,
      backoffFactor: 2,
      retryableErrors: [ErrorType.NETWORK]
    });
    const result = await manager.executeWithBackoff(async () => {
      attempts++;
      if (attempts < 2) throw new AutomationError('fail', ErrorType.NETWORK);
      return 'success';
    });
    expect(result).toBe('success');
    expect(attempts).toBe(2);
  });

  it('throws after max attempts on retryable error', async () => {
    const manager = new RetryManager({
      maxAttempts: 2,
      initialDelay: 1,
      maxDelay: 10,
      backoffFactor: 2,
      retryableErrors: [ErrorType.NETWORK]
    });
    let attempts = 0;
    try {
      await manager.executeWithBackoff(async () => {
        attempts++;
        throw new AutomationError('fail', ErrorType.NETWORK);
      });
    } catch (err) {
      expect((err as Error).message).toContain('Operation failed after 2 attempts');
      expect(attempts).toBe(2);
    }
  });

  it('throws immediately on non-retryable error', async () => {
    const manager = new RetryManager({ retryableErrors: [ErrorType.NETWORK] });
    await expect(manager.executeWithBackoff(async () => {
      throw new AutomationError('fail', ErrorType.AUTH_FAILED);
    })).rejects.toThrow('fail');
  });

  it('returns result on first try if no error', async () => {
    const manager = new RetryManager();
    const result = await manager.executeWithBackoff(async () => 'ok');
    expect(result).toBe('ok');
  });

  it('throws last error if all attempts exhausted (coverage for fallback throw)', async () => {
    const manager = new RetryManager({ maxAttempts: 1, retryableErrors: [ErrorType.NETWORK] });
    await expect(manager.executeWithBackoff(async () => {
      throw new Error('unexpected');
    })).rejects.toThrow('unexpected');
  });

  it('isRetryableError returns false for non-AutomationError', () => {
    const manager = new RetryManager();
    // @ts-ignore
    expect(manager["isRetryableError"](new Error('nope'))).toBe(false);
  });

  it('isRetryableError returns true for AutomationError with retryable type', () => {
    const manager = new RetryManager({ retryableErrors: [ErrorType.NETWORK] });
    // @ts-ignore
    expect(manager["isRetryableError"](new AutomationError('fail', ErrorType.NETWORK))).toBe(true);
  });

  it('isRetryableError returns false for AutomationError with non-retryable type', () => {
    const manager = new RetryManager({ retryableErrors: [ErrorType.NETWORK] });
    // @ts-ignore
    expect(manager["isRetryableError"](new AutomationError('fail', ErrorType.AUTH_FAILED))).toBe(false);
  });
});
