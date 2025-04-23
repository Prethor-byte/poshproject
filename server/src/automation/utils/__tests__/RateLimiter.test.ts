import { RateLimiter, RateLimitConfig } from '../RateLimiter';

const defaultConfig: RateLimitConfig = {
  maxRequestsPerMinute: 3,
  maxRequestsPerHour: 5,
  maxConcurrentRequests: 2,
  cooldownPeriod: 200, // ms
};

describe('RateLimiter', () => {
  let limiter: RateLimiter;
  const userId = 'user-1';
  const user2 = 'user-2';

  beforeEach(() => {
    // Reset singleton for test isolation
    (RateLimiter as any).instance = undefined;
    limiter = RateLimiter.getInstance({ ...defaultConfig });
  });

  it('allows requests under the limit', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
  });

  it('blocks requests over max concurrent', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    expect(await limiter.acquireToken(userId)).toBe(true);
    expect(await limiter.acquireToken(userId)).toBe(false);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
  });

  it('respects cooldown period', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    expect(await limiter.acquireToken(userId)).toBe(false);
    await new Promise(res => setTimeout(res, defaultConfig.cooldownPeriod + 10));
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
  });

  it('respects maxRequestsPerMinute', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    // 4th request should be blocked (limit is 3 per minute)
    expect(await limiter.acquireToken(userId)).toBe(false);
  });

  it('enforces maxRequestsPerHour', async () => {
    for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) {
      expect(await limiter.acquireToken(user2)).toBe(true);
      limiter.releaseToken(user2);
    }
    expect(await limiter.acquireToken(user2)).toBe(false);
  });

  it('updates config dynamically', async () => {
    limiter.updateConfig({ maxRequestsPerMinute: 5 });
    for (let i = 0; i < 5; i++) {
      expect(await limiter.acquireToken(userId)).toBe(true);
      limiter.releaseToken(userId);
    }
    expect(await limiter.acquireToken(userId)).toBe(false);
  });

  it('provides correct rate limit info', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    const info = limiter.getRateLimitInfo(userId);
    expect(info.remainingRequests).toBeGreaterThanOrEqual(0);
    expect(typeof info.nextResetTime).toBe('object');
    expect(typeof info.isRateLimited).toBe('boolean');
  });

  it('falls back to default config if none provided', () => {
    (RateLimiter as any).instance = undefined;
    const limiterDefault = RateLimiter.getInstance();
    expect(limiterDefault).toBeDefined();
    expect((limiterDefault as any).config.maxRequestsPerMinute).toBe(30);
    expect((limiterDefault as any).config.maxRequestsPerHour).toBe(300);
    expect((limiterDefault as any).config.maxConcurrentRequests).toBe(5);
    expect((limiterDefault as any).config.cooldownPeriod).toBe(2000);
  });

  it('handles edge case: hour limit more restrictive than minute', async () => {
    limiter.updateConfig({ maxRequestsPerMinute: 10, maxRequestsPerHour: 2 });
    // Acquire up to hour limit
    let tokensGranted = 0;
    for (let i = 0; i < 2; i++) {
      if (await limiter.acquireToken(userId)) {
        tokensGranted++;
        limiter.releaseToken(userId);
      }
    }
    expect(tokensGranted).toBe(2);
    const info = limiter.getRateLimitInfo(userId);
    expect(info.remainingRequests).toBe(0);
    expect(info.isRateLimited).toBe(true);
  });

  it('handles edge case: cooldown is next reset', async () => {
    await limiter.acquireToken(userId);
    limiter.releaseToken(userId);
    const info = limiter.getRateLimitInfo(userId);
    // nextResetTime should be close to now + cooldownPeriod
    const now = Date.now();
    expect(info.nextResetTime.getTime()).toBeGreaterThanOrEqual(now);
    expect(info.nextResetTime.getTime()).toBeLessThanOrEqual(now + defaultConfig.cooldownPeriod + 50);
  });

  it('does not leak singleton between tests', () => {
    const limiter2 = RateLimiter.getInstance();
    expect(limiter2).toBe(limiter);
  });

  it('logs debug for per-minute, per-hour, concurrent, and cooldown', async () => {
    const logger = require('../logger').logger;
    jest.spyOn(logger, 'debug');
    // Fill up concurrent
    await limiter.acquireToken(userId);
    await limiter.acquireToken(userId);
    await limiter.acquireToken(user2);
    // Fill up per-minute
    limiter.releaseToken(userId);
    limiter.releaseToken(user2);
    for (let i = 0; i < defaultConfig.maxRequestsPerMinute; i++) {
      await limiter.acquireToken(user2);
      limiter.releaseToken(user2);
    }
    // Fill up per-hour
    for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) {
      await limiter.acquireToken(user2);
      limiter.releaseToken(user2);
    }
    // Cooldown
    await limiter.acquireToken(userId);
    limiter.releaseToken(userId);
    await limiter.acquireToken(userId);
    expect(logger.debug).toHaveBeenCalled();
  });

  it('handles multiple users independently', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    expect(await limiter.acquireToken(user2)).toBe(true);
    limiter.releaseToken(userId);
    limiter.releaseToken(user2);
  });
});
