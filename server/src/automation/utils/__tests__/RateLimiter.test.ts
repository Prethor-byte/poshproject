import { RateLimiter, RateLimitConfig } from '../RateLimiter';

jest.useFakeTimers();

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

  let now = Date.now();
  beforeEach(() => {
    // Reset singleton for test isolation
    (RateLimiter as any).instance = undefined;
    limiter = RateLimiter.getInstance({ ...defaultConfig });
    limiter._reset();
    now = Date.now();
    limiter._setNow(() => new Date(now));
    jest.setSystemTime(now);
  });

  it('allows requests under the limit', async () => {
    const first = await limiter.acquireToken(userId);
    console.log('After first acquire:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    const second = await limiter.acquireToken(userId);
    console.log('After second acquire:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(first).toBe(true);
    expect(second).toBe(true);
    // Third should be false
    const third = await limiter.acquireToken(userId);
    console.log('After third acquire:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(third).toBe(false);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
    // Log state
    console.log('End of test - requests:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
  });

  it('blocks requests over max concurrent', async () => {
    // Fill up concurrency
    await limiter.acquireToken(userId);
    await limiter.acquireToken(userId);
    // Third should be blocked
    const blocked = await limiter.acquireToken(userId);
    expect(blocked).toBe(false);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
  });

  it('respects cooldown period', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    expect(await limiter.acquireToken(userId)).toBe(false);
    // Advance fake timer by cooldown
    now += defaultConfig.cooldownPeriod + 10;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
  });

  it('respects maxRequestsPerMinute', async () => {
    limiter.updateConfig({ maxConcurrentRequests: 3 });
    const tokens: boolean[] = [];
    for (let i = 0; i < 3; i++) {
      const token = await limiter.acquireToken(userId);
      console.log(`After acquire ${i+1}:`, (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
      tokens.push(token);
    }
    tokens.forEach(token => expect(token).toBe(true));
    // 4th request should be blocked (limit is 3 per minute)
    const fourth = await limiter.acquireToken(userId);
    console.log('After fourth acquire:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(fourth).toBe(false);
    // Now release all tokens
    for (let i = 0; i < 3; i++) limiter.releaseToken(userId);
    // Advance time by 1 minute
    now += 60 * 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    // Now should allow again
    const afterMinute = await limiter.acquireToken(userId);
    console.log('After minute advanced:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(afterMinute).toBe(true);
    limiter.releaseToken(userId);
  });

  it('enforces maxRequestsPerHour', async () => {
    limiter.updateConfig({ maxConcurrentRequests: defaultConfig.maxRequestsPerHour });
    const tokens: boolean[] = [];
    for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) {
      const token = await limiter.acquireToken(user2);
      console.log(`After acquire ${i+1}:`, (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
      tokens.push(token);
      // Rozłóż żądania na godzinę
      now += (60 * 60 * 1000) / defaultConfig.maxRequestsPerHour;
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
    }
    tokens.forEach(token => expect(token).toBe(true));
    const afterLimit = await limiter.acquireToken(user2);
    console.log('After limit reached:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(afterLimit).toBe(false);
    // Now release all tokens
    for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) limiter.releaseToken(user2);
  });

  it('updates config dynamically', async () => {
    limiter._reset();
    limiter.updateConfig({ maxRequestsPerMinute: 5, maxConcurrentRequests: 5 });
    let afterLimit = false;
    for (let i = 0; i < 5; i++) {
      now += 1000; // advance by 1 second per request
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
      afterLimit = await limiter.acquireToken(userId);
      console.log(`After acquire ${i+1}:`, (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    }
    expect(afterLimit).toBe(true);
    const afterLimit2 = await limiter.acquireToken(userId);
    console.log('After limit reached:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(afterLimit2).toBe(false);
    // Now release all tokens
    for (let i = 0; i < 5; i++) limiter.releaseToken(userId);
    // Retrieve latest lastRequest after releasing tokens
    const lastRequestAfterRelease = (limiter as any).userLastRequest.get(userId) as Date;
    now = lastRequestAfterRelease.getTime() + 60 * 1000 + defaultConfig.cooldownPeriod + 1;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    // Debug: print timestamps of all requests
    console.log('Request timestamps after time advance:', (limiter as any).requests.map((r: {timestamp: Date}) => r.timestamp.toISOString()));
    // Additional debug logs
    console.log('userActiveRequests:', JSON.stringify(Array.from((limiter as any).userActiveRequests.entries())));
    console.log('userLastRequest:', (limiter as any).userLastRequest.get(userId));
    console.log('requests:', (limiter as any).requests.map((r: {userId: string, timestamp: Date}) => ({ userId: r.userId, timestamp: r.timestamp.toISOString() })));
    console.log('config:', (limiter as any).config);
    // Print per-minute and per-hour request counts
    console.log('getRequestsInLastMinute:', (limiter as any).getRequestsInLastMinute(userId));
    console.log('getRequestsInLastHour:', (limiter as any).getRequestsInLastHour(userId));
    const afterMinute = await limiter.acquireToken(userId);
    console.log('After minute advanced:', (limiter as any).requests.length, 'active:', (limiter as any).activeRequests);
    expect(afterMinute).toBe(true);
    limiter.releaseToken(userId);
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
    let tokensGranted = 0;
    for (let i = 0; i < 2; i++) {
      expect(await limiter.acquireToken(userId)).toBe(true);
      tokensGranted++;
      limiter.releaseToken(userId);
      now += 1000; // rozłóż w czasie
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
    }
    expect(tokensGranted).toBe(2);
    expect(await limiter.acquireToken(userId)).toBe(false);
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
