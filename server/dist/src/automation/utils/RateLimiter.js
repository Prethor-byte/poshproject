"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const logger_1 = require("./logger");
class RateLimiter {
    /**
     * For testing only: allow injection of custom time source
     */
    _setNow(fn) { this._now = fn; }
    // For testing purposes only
    _reset() {
        this.requests = [];
        this.activeRequests = 0;
        this.userLastRequest.clear();
        this._now = () => new Date();
    }
    constructor(config) {
        this.config = config;
        this.requests = [];
        this.activeRequests = 0;
        this.userLastRequest = new Map();
        // Allow injection of custom time source for tests
        this._now = () => new Date();
        // For debug
        logger_1.logger.debug('RateLimiter initialized', { config });
    }
    static getInstance(config) {
        if (!RateLimiter.instance) {
            if (!config) {
                config = {
                    maxRequestsPerMinute: 30,
                    maxRequestsPerHour: 300,
                    maxConcurrentRequests: 5,
                    cooldownPeriod: 2000, // 2 seconds between requests
                };
            }
            RateLimiter.instance = new RateLimiter(config);
        }
        return RateLimiter.instance;
    }
    cleanOldRequests() {
        const now = this._now();
        const before = this.requests.length;
        this.requests = this.requests.filter(r => now.getTime() - r.timestamp.getTime() < 60 * 60 * 1000);
        logger_1.logger.debug('cleanOldRequests', { before, after: this.requests.length });
    }
    getRequestsInLastMinute(userId) {
        this.cleanOldRequests();
        const now = this._now();
        return this.requests.filter(r => r.userId === userId && now.getTime() - r.timestamp.getTime() < 60 * 1000).length;
    }
    getRequestsInLastHour(userId) {
        this.cleanOldRequests();
        const now = this._now();
        return this.requests.filter(r => r.userId === userId && now.getTime() - r.timestamp.getTime() < 60 * 60 * 1000).length;
    }
    canMakeRequest(userId) {
        this.cleanOldRequests();
        // Check concurrent requests limit
        if (this.activeRequests >= this.config.maxConcurrentRequests) {
            logger_1.logger.debug('Rate limit: Max concurrent requests reached', {
                userId,
                activeRequests: this.activeRequests,
                maxConcurrent: this.config.maxConcurrentRequests
            });
            return false;
        }
        // Check per-minute limit (per user)
        if (this.getRequestsInLastMinute(userId) >= this.config.maxRequestsPerMinute) {
            logger_1.logger.debug('Rate limit: Max requests per minute reached', {
                userId,
                requestsLastMinute: this.getRequestsInLastMinute(userId)
            });
            return false;
        }
        // Check per-hour limit (per user)
        if (this.getRequestsInLastHour(userId) >= this.config.maxRequestsPerHour) {
            logger_1.logger.debug('Rate limit: Max requests per hour reached', {
                userId,
                requestsLastHour: this.getRequestsInLastHour(userId)
            });
            return false;
        }
        // Check cooldown period
        const lastRequest = this.userLastRequest.get(userId);
        if (lastRequest) {
            const timeSinceLastRequest = this._now().getTime() - lastRequest.getTime();
            if (timeSinceLastRequest < this.config.cooldownPeriod) {
                logger_1.logger.debug('Rate limit: Cooldown period not elapsed', {
                    userId,
                    timeSinceLastRequest
                });
                return false;
            }
        }
        return true;
    }
    async acquireToken(userId) {
        this.cleanOldRequests();
        logger_1.logger.debug('acquireToken called', { userId, activeRequests: this.activeRequests });
        if (!this.canMakeRequest(userId)) {
            logger_1.logger.debug('acquireToken: cannot make request', { userId });
            return false;
        }
        this.activeRequests++;
        const now = this._now();
        this.requests.push({
            timestamp: now,
            userId
        });
        this.userLastRequest.set(userId, now);
        logger_1.logger.debug('acquireToken: token granted', { userId, activeRequests: this.activeRequests });
        return true;
    }
    releaseToken(userId) {
        if (this.activeRequests > 0) {
            this.activeRequests--;
            logger_1.logger.debug('releaseToken: token released', { userId, activeRequests: this.activeRequests });
        }
        else {
            logger_1.logger.debug('releaseToken: called with 0 activeRequests', { userId });
        }
    }
    getRateLimitInfo(userId) {
        this.cleanOldRequests();
        const now = this._now();
        const requestsLastMinute = this.getRequestsInLastMinute(userId);
        const requestsLastHour = this.getRequestsInLastHour(userId);
        const lastRequest = this.userLastRequest.get(userId);
        let nextResetTime = new Date(now.getTime() + 60 * 1000); // Default to 1 minute from now
        let remainingRequests = this.config.maxRequestsPerMinute - requestsLastMinute;
        // If hour limit is more restrictive
        if ((this.config.maxRequestsPerHour - requestsLastHour) < remainingRequests) {
            remainingRequests = this.config.maxRequestsPerHour - requestsLastHour;
            nextResetTime = new Date(now.getTime() + 60 * 60 * 1000);
        }
        // If in cooldown period
        if (lastRequest) {
            const cooldownEnds = new Date(lastRequest.getTime() + this.config.cooldownPeriod);
            if (cooldownEnds > now && cooldownEnds < nextResetTime) {
                nextResetTime = cooldownEnds;
            }
        }
        return {
            remainingRequests: Math.max(0, remainingRequests),
            nextResetTime,
            isRateLimited: !this.canMakeRequest(userId)
        };
    }
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        logger_1.logger.info('Rate limiter config updated', { newConfig });
    }
}
exports.RateLimiter = RateLimiter;
