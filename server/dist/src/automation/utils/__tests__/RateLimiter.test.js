"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RateLimiter_1 = require("../RateLimiter");
jest.useFakeTimers();
const defaultConfig = {
    maxRequestsPerMinute: 3,
    maxRequestsPerHour: 5,
    maxConcurrentRequests: 2,
    cooldownPeriod: 200, // ms
};
describe('RateLimiter', () => {
    let limiter;
    const userId = 'user-1';
    const user2 = 'user-2';
    let now = Date.now();
    beforeEach(() => {
        // Reset singleton for test isolation
        RateLimiter_1.RateLimiter.instance = undefined;
        limiter = RateLimiter_1.RateLimiter.getInstance({ ...defaultConfig });
        limiter._reset();
        now = Date.now();
        limiter._setNow(() => new Date(now));
        jest.setSystemTime(now);
    });
    it('allows requests under the limit', async () => {
        const first = await limiter.acquireToken(userId);
        const second = await limiter.acquireToken(userId);
        expect(first).toBe(true);
        expect(second).toBe(true);
        // Third should be false
        const third = await limiter.acquireToken(userId);
        expect(third).toBe(false);
        limiter.releaseToken(userId);
        limiter.releaseToken(userId);
        // Log state
        console.log('requests:', limiter.requests.length, 'active:', limiter.activeRequests);
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
        for (let i = 0; i < 3; i++) {
            expect(await limiter.acquireToken(userId)).toBe(true);
            limiter.releaseToken(userId);
        }
        // 4th request should be blocked (limit is 3 per minute)
        expect(await limiter.acquireToken(userId)).toBe(false);
        // Advance time by 1 minute
        now += 60 * 1000;
        jest.setSystemTime(now);
        limiter._setNow(() => new Date(now));
        // Now should allow again
        expect(await limiter.acquireToken(userId)).toBe(true);
        limiter.releaseToken(userId);
    });
    it('enforces maxRequestsPerHour', async () => {
        let tokens = 0;
        for (let i = 0; i < defaultConfig.maxRequestsPerHour; i++) {
            expect(await limiter.acquireToken(user2)).toBe(true);
            limiter.releaseToken(user2);
            tokens++;
            // Rozłóż żądania na godzinę
            now += (60 * 60 * 1000) / defaultConfig.maxRequestsPerHour;
            jest.setSystemTime(now);
            limiter._setNow(() => new Date(now));
        }
        expect(tokens).toBe(defaultConfig.maxRequestsPerHour);
        expect(await limiter.acquireToken(user2)).toBe(false);
    });
    it('updates config dynamically', async () => {
        limiter.updateConfig({ maxRequestsPerMinute: 5 });
        for (let i = 0; i < 5; i++) {
            expect(await limiter.acquireToken(userId)).toBe(true);
            limiter.releaseToken(userId);
        }
        expect(await limiter.acquireToken(userId)).toBe(false);
        // Advance time by 1 minute
        now += 60 * 1000;
        jest.setSystemTime(now);
        limiter._setNow(() => new Date(now));
        expect(await limiter.acquireToken(userId)).toBe(true);
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
        RateLimiter_1.RateLimiter.instance = undefined;
        const limiterDefault = RateLimiter_1.RateLimiter.getInstance();
        expect(limiterDefault).toBeDefined();
        expect(limiterDefault.config.maxRequestsPerMinute).toBe(30);
        expect(limiterDefault.config.maxRequestsPerHour).toBe(300);
        expect(limiterDefault.config.maxConcurrentRequests).toBe(5);
        expect(limiterDefault.config.cooldownPeriod).toBe(2000);
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
        const limiter2 = RateLimiter_1.RateLimiter.getInstance();
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
