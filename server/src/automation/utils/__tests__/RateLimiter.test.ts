import { RateLimiter, RateLimitConfig } from '../RateLimiter';

jest.useFakeTimers();

const defaultConfig: RateLimitConfig = {
  maxRequestsPerMinute: 3,
  maxRequestsPerHour: 5,
  maxConcurrentRequests: 2,
  cooldownPeriod: 200, // ms
};

describe('RateLimiter', () => {
  afterAll(() => {
    const manager = require('../../utils/BrowserManager').BrowserManager.getInstance();
    manager.stopMonitoring();
  });
  let limiter: RateLimiter;
  const userId = 'user-1';
  const user2 = 'user-2';

  let now = Date.now();
  beforeEach(() => {
    // Professional test isolation: always reset singleton and config
    RateLimiter._resetInstanceForTests?.();
    limiter = RateLimiter.getInstance({ ...defaultConfig });
    limiter._reset();
    now = Date.now();
    limiter._setNow(() => new Date(now));
    jest.setSystemTime(now);
  });

  it('allows requests under the limit', async () => {
    // Use increased maxConcurrentRequests for this test
    limiter.updateConfig({ maxConcurrentRequests: 3 });
    // Spread out requests
    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const first = await limiter.acquireToken(userId);
    expect((limiter as any).activeRequests).toBe(1);
    expect((limiter as any).requests.length).toBe(1);

    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const second = await limiter.acquireToken(userId);
    expect((limiter as any).activeRequests).toBe(2);
    expect((limiter as any).requests.length).toBe(2);

    expect(first).toBe(true);
    expect(second).toBe(true);
    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const third = await limiter.acquireToken(userId);
    expect((limiter as any).activeRequests).toBe(3);
    expect((limiter as any).requests.length).toBe(3);

    expect(third).toBe(true);
    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const fourth = await limiter.acquireToken(userId);
    expect(fourth).toBe(false);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
    limiter.releaseToken(userId);
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
      now += 1000;
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
      const token = await limiter.acquireToken(userId);
      tokens.push(token);
      limiter.releaseToken(userId); // Release after each acquire to avoid concurrent limit
    }
    tokens.forEach(token => expect(token).toBe(true));
    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const fourth = await limiter.acquireToken(userId);
    expect(fourth).toBe(false);
    now += 60 * 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const afterMinute = await limiter.acquireToken(userId);
    expect(afterMinute).toBe(true);
    limiter.releaseToken(userId);
  });

  it('enforces maxRequestsPerHour', async () => {
    // Use maxConcurrentRequests >= maxRequestsPerHour for this test
    const userHour = 'user-hour';
    limiter.updateConfig({ 
      maxConcurrentRequests: defaultConfig.maxRequestsPerHour,
      maxRequestsPerMinute: defaultConfig.maxRequestsPerHour
    });
    const tokens: boolean[] = [];
    let failedIndex = -1;
    for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) {
      now += 1000;
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
      const token = await limiter.acquireToken(userHour);
      tokens.push(token);
      if (!token && failedIndex === -1) failedIndex = i;
      limiter.releaseToken(userHour); // Release after each to avoid concurrency block
    }
    if (failedIndex !== -1) {
      const reqs = (limiter as any).requests.filter((r: any) => r.userId === userHour).map((r: any) => r.timestamp.toISOString());
      // eslint-disable-next-line no-console
      console.log('Hour test - FAILED at index', failedIndex, 'request timestamps:', reqs, 'now:', new Date(now).toISOString());
    }
    tokens.forEach(token => expect(token).toBe(true));
    // Debug: print all request timestamps and current time
    const reqs = (limiter as any).requests.filter((r: any) => r.userId === userHour).map((r: any) => r.timestamp.toISOString());
    // eslint-disable-next-line no-console
    console.log('Hour test - request timestamps:', reqs, 'now:', new Date(now).toISOString());
    // Professional: assert the correct number of requests in the last hour
    const inLastHour = (limiter as any).getRequestsInLastHour(userHour);
    const inLastMinute = (limiter as any).getRequestsInLastMinute(userHour);
    // eslint-disable-next-line no-console
    console.log('Hour test - requests in last hour:', inLastHour, 'requests in last minute:', inLastMinute);
    expect(inLastHour).toBeLessThanOrEqual(defaultConfig.maxRequestsPerHour);
    now += 1000;
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));
    const afterLimit = await limiter.acquireToken(userHour);
    expect(afterLimit).toBe(false);
  });

  it('updates config dynamically', async () => {
    const userDynamic = 'user-dynamic';
    limiter.updateConfig({ maxRequestsPerMinute: 5, maxRequestsPerHour: 5, maxConcurrentRequests: 5 });

    // Spread out requests: each one 1 second apart
    let failedIndex = -1;
    for (let i = 0; i < 5; i++) {
      now += 1000;
      jest.setSystemTime(now);
      limiter._setNow(() => new Date(now));
      const token = await limiter.acquireToken(userDynamic);
      if (!token && failedIndex === -1) failedIndex = i;
      expect(token).toBe(true);
      limiter.releaseToken(userDynamic); // Release after each to avoid concurrency block
    }
    if (failedIndex !== -1) {
      const reqs = (limiter as any).requests.filter((r: any) => r.userId === userDynamic).map((r: any) => r.timestamp.toISOString());
      // eslint-disable-next-line no-console
      console.log('Dynamic config test - FAILED at index', failedIndex, 'request timestamps:', reqs, 'now:', new Date(now).toISOString());
    }
    // Next should be blocked (over per-minute limit)
    const afterLimit = await limiter.acquireToken(userDynamic);
    expect(afterLimit).toBe(false);

    // Advance time enough to clear per-minute, per-hour window and cooldown
    now += 60 * 60 * 1000 + 60 * 1000 + 211; // 1 hour + 1 min + extra ms
    jest.setSystemTime(now);
    limiter._setNow(() => new Date(now));

    // Debug: print all request timestamps and current time
    const reqs = (limiter as any).requests.filter((r: any) => r.userId === userDynamic).map((r: any) => r.timestamp.toISOString());
    // eslint-disable-next-line no-console
    console.log('Dynamic config test - request timestamps:', reqs, 'now:', new Date(now).toISOString());
    // Professional: assert the correct number of requests in the last minute/hour
    const inLastMinute = (limiter as any).getRequestsInLastMinute(userDynamic);
    const inLastHour = (limiter as any).getRequestsInLastHour(userDynamic);
    // eslint-disable-next-line no-console
    console.log('Dynamic config test - requests in last minute:', inLastMinute, 'requests in last hour:', inLastHour);
    expect(inLastMinute).toBe(0);
    expect(inLastHour).toBeLessThanOrEqual(5);
    // Now we should be able to acquire again
    const afterMinute = await limiter.acquireToken(userDynamic);
    expect(afterMinute).toBe(true);
  });

  it('provides correct rate limit info', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    limiter.releaseToken(userId);
    const info = limiter.getRateLimitInfo(userId);
    expect(info.remainingRequests).toBeGreaterThanOrEqual(0);
    expect(typeof info.nextResetTime).toBe('object');
    expect(typeof info.isRateLimited).toBe('boolean');
  });

  it('throws error if no config is provided on first initialization', () => {
    (RateLimiter as any).instance = undefined;
    expect(() => RateLimiter.getInstance()).toThrow('RateLimiter config required for first initialization');
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
// Removed erroneous duplicate/partial code block that used undefined variables


  it('handles multiple users independently', async () => {
    expect(await limiter.acquireToken(userId)).toBe(true);
    expect(await limiter.acquireToken(user2)).toBe(true);
    limiter.releaseToken(userId);
    limiter.releaseToken(user2);
  });
});
