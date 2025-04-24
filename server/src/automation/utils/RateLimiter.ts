import { logger } from './logger';

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  maxConcurrentRequests: number;
  cooldownPeriod: number; // milliseconds
}

export interface RateLimitInfo {
  remainingRequests: number;
  nextResetTime: Date;
  isRateLimited: boolean;
}

interface RequestRecord {
  timestamp: Date;
  userId: string;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private requests: RequestRecord[] = [];
  private activeRequests: number = 0;
  private userLastRequest: Map<string, Date> = new Map();
  private userActiveRequests: Map<string, number> = new Map();

  // Allow injection of custom time source for tests
  private _now: () => Date = () => new Date();
  /**
   * For testing only: allow injection of custom time source
   */
  public _setNow(fn: () => Date) { this._now = fn; }


  // For testing purposes only
  public _reset(): void {
    this.requests = [];
    this.activeRequests = 0;
    this.userLastRequest.clear();
    this.userActiveRequests.clear();
    this._now = () => new Date();
  }

  private constructor(private config: RateLimitConfig) {
    // For debug
    logger.debug('RateLimiter initialized', { config });
  }

  static getInstance(config?: RateLimitConfig): RateLimiter {
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

  private cleanOldRequests(): void {
    const now = this._now();
    const before = this.requests.length;
    // Only remove requests older than 1 hour (do NOT remove requests within the last hour)
    const purged = this.requests.filter(
      r => now.getTime() - r.timestamp.getTime() >= 60 * 60 * 1000
    );
    this.requests = this.requests.filter(
      r => now.getTime() - r.timestamp.getTime() < 60 * 60 * 1000
    );
    // Remove userLastRequest entries older than 1 hour
    for (const [userId, lastRequest] of this.userLastRequest.entries()) {
      if (now.getTime() - lastRequest.getTime() >= 60 * 60 * 1000) {
        this.userLastRequest.delete(userId);
      }
    }
    logger.debug('cleanOldRequests', { before, after: this.requests.length, purged });
  }

  // Returns the number of requests for this user in the last 60 seconds (strictly < 60s window)
  private getRequestsInLastMinute(userId: string): number {
    const now = this._now();
    return this.requests.filter(
      r => r.userId === userId && now.getTime() - r.timestamp.getTime() < 60 * 1000
    ).length;
  }

  // Returns the number of requests for this user in the last hour (strictly < 1h window)
  private getRequestsInLastHour(userId: string): number {
    const now = this._now();
    return this.requests.filter(
      r => r.userId === userId && now.getTime() - r.timestamp.getTime() < 60 * 60 * 1000
    ).length;
  }

  private canMakeRequest(userId: string): boolean {
    this.cleanOldRequests();

    // Check global concurrent requests limit
    if (this.activeRequests >= this.config.maxConcurrentRequests) {
      logger.debug('canMakeRequest: blocked by global concurrent', { activeRequests: this.activeRequests, limit: this.config.maxConcurrentRequests });
      logger.debug('Rate limit: Max concurrent requests reached', {
        userId,
        activeRequests: this.activeRequests,
        maxConcurrent: this.config.maxConcurrentRequests
      });
      return false;
    }

    // Check per-user concurrent requests limit
    const userActive = this.userActiveRequests.get(userId) || 0;
    // Only enforce concurrent limit if userActive > 0 (i.e., not all tokens released)
    if (userActive >= this.config.maxConcurrentRequests && userActive > 0) {
      logger.debug('canMakeRequest: blocked by per-user concurrent', { userActive, limit: this.config.maxConcurrentRequests });
      logger.debug('Rate limit: Max concurrent requests reached for user', {
        userId,
        userActive,
        maxConcurrent: this.config.maxConcurrentRequests
      });
      return false;
    }

    // Check per-minute limit (per user)
    const reqsLastMin = this.getRequestsInLastMinute(userId);
    if (reqsLastMin >= this.config.maxRequestsPerMinute) {
      logger.debug('canMakeRequest: blocked by per-minute', { reqsLastMin, limit: this.config.maxRequestsPerMinute });
      logger.debug('Rate limit: Max requests per minute reached', {
        userId,
        requestsLastMinute: this.getRequestsInLastMinute(userId)
      });
      return false;
    }

    // Check per-hour limit (per user)
    const reqsLastHour = this.getRequestsInLastHour(userId);
    if (reqsLastHour >= this.config.maxRequestsPerHour) {
      logger.debug('canMakeRequest: blocked by per-hour', { reqsLastHour, limit: this.config.maxRequestsPerHour });
      logger.debug('Rate limit: Max requests per hour reached', {
        userId,
        requestsLastHour: this.getRequestsInLastHour(userId)
      });
      return false;
    }

    // Check cooldown period only if user has no active requests
    if (userActive === 0) {
      logger.debug('canMakeRequest: checking cooldown', { userActive });
      const lastRequest = this.userLastRequest.get(userId);
      if (lastRequest) {
        const nowTime = this._now();
        const timeSinceLastRequest = nowTime.getTime() - lastRequest.getTime();
        console.log('[DEBUG] canMakeRequest cooldown check:', {
          now: nowTime.toISOString(),
          lastRequest: lastRequest.toISOString(),
          timeSinceLastRequest,
          cooldown: this.config.cooldownPeriod
        });
        if (timeSinceLastRequest < this.config.cooldownPeriod) {
          logger.debug('canMakeRequest: blocked by cooldown', { timeSinceLastRequest, cooldown: this.config.cooldownPeriod });
          logger.debug('Rate limit: Cooldown period not elapsed', {
            userId,
            timeSinceLastRequest
          });
          return false;
        }
      }
    }

    return true;
  }

  async acquireToken(userId: string): Promise<boolean> {
    this.cleanOldRequests();
    const now = this._now();
    const beforeMinute = this.getRequestsInLastMinute(userId);
    const beforeHour = this.getRequestsInLastHour(userId);
    // eslint-disable-next-line no-console
    console.log('[acquireToken] BEFORE', { userId, now: now.toISOString(), beforeMinute, beforeHour });
    logger.debug('acquireToken called', { userId, activeRequests: this.activeRequests });
    if (!this.canMakeRequest(userId)) {
      logger.debug('acquireToken: cannot make request', { userId });
      // eslint-disable-next-line no-console
      console.log('[acquireToken] BLOCKED', { userId, now: now.toISOString(), beforeMinute, beforeHour });
      return false;
    }
    this.activeRequests++;
    const userActive = this.userActiveRequests.get(userId) || 0;
    this.userActiveRequests.set(userId, userActive + 1);
    this.requests.push({
      timestamp: now,
      userId
    });
    this.userLastRequest.set(userId, now);
    const afterMinute = this.getRequestsInLastMinute(userId);
    const afterHour = this.getRequestsInLastHour(userId);
    const userReqs = this.requests.filter(r => r.userId === userId).map(r => r.timestamp.toISOString());
    // eslint-disable-next-line no-console
    console.log('[acquireToken] AFTER', { userId, now: now.toISOString(), afterMinute, afterHour, userReqs });
    logger.debug('acquireToken: token granted', { userId, activeRequests: this.activeRequests, userActive: this.userActiveRequests.get(userId) });
    return true;
  }

  releaseToken(userId: string): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
      const userActive = this.userActiveRequests.get(userId) || 0;
      if (userActive > 0) {
        this.userActiveRequests.set(userId, userActive - 1);
      }
      logger.debug('releaseToken: token released', { userId, activeRequests: this.activeRequests, userActive: this.userActiveRequests.get(userId) });
    } else {
      logger.debug('releaseToken: called with 0 activeRequests', { userId });
    }
  }

  getRateLimitInfo(userId: string): RateLimitInfo {
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

  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    const oldConfig = { ...this.config };
    this.config = {
      ...this.config,
      ...newConfig
    };
    logger.info('Rate limiter config updated', { newConfig });
    // If limits are increased, reset userLastRequest to avoid stale cooldowns blocking new requests
    if ((newConfig.maxRequestsPerMinute && newConfig.maxRequestsPerMinute > oldConfig.maxRequestsPerMinute) ||
        (newConfig.maxRequestsPerHour && newConfig.maxRequestsPerHour > oldConfig.maxRequestsPerHour)) {
      this.userLastRequest.clear();
      logger.info('userLastRequest cleared due to increased limits');
    }
  }
}
