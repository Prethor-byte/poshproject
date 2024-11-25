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

  private constructor(private config: RateLimitConfig) {}

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
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    this.requests = this.requests.filter(req => req.timestamp > oneHourAgo);
  }

  private getRequestsInLastMinute(userId?: string): number {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    return this.requests.filter(req => 
      req.timestamp > oneMinuteAgo && 
      (!userId || req.userId === userId)
    ).length;
  }

  private getRequestsInLastHour(userId?: string): number {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return this.requests.filter(req => 
      req.timestamp > oneHourAgo && 
      (!userId || req.userId === userId)
    ).length;
  }

  private canMakeRequest(userId: string): boolean {
    this.cleanOldRequests();

    // Check concurrent requests limit
    if (this.activeRequests >= this.config.maxConcurrentRequests) {
      logger.debug('Rate limit: Max concurrent requests reached', {
        userId,
        activeRequests: this.activeRequests,
        maxConcurrent: this.config.maxConcurrentRequests
      });
      return false;
    }

    // Check per-minute limit
    if (this.getRequestsInLastMinute() >= this.config.maxRequestsPerMinute) {
      logger.debug('Rate limit: Max requests per minute reached', {
        userId,
        requestsLastMinute: this.getRequestsInLastMinute()
      });
      return false;
    }

    // Check per-hour limit
    if (this.getRequestsInLastHour() >= this.config.maxRequestsPerHour) {
      logger.debug('Rate limit: Max requests per hour reached', {
        userId,
        requestsLastHour: this.getRequestsInLastHour()
      });
      return false;
    }

    // Check cooldown period
    const lastRequest = this.userLastRequest.get(userId);
    if (lastRequest) {
      const timeSinceLastRequest = new Date().getTime() - lastRequest.getTime();
      if (timeSinceLastRequest < this.config.cooldownPeriod) {
        logger.debug('Rate limit: Cooldown period not elapsed', {
          userId,
          timeSinceLastRequest,
          cooldownPeriod: this.config.cooldownPeriod
        });
        return false;
      }
    }

    return true;
  }

  async acquireToken(userId: string): Promise<boolean> {
    if (!this.canMakeRequest(userId)) {
      return false;
    }

    this.activeRequests++;
    this.requests.push({
      timestamp: new Date(),
      userId
    });
    this.userLastRequest.set(userId, new Date());

    return true;
  }

  releaseToken(userId: string): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
  }

  getRateLimitInfo(userId: string): RateLimitInfo {
    this.cleanOldRequests();

    const now = new Date();
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
    this.config = {
      ...this.config,
      ...newConfig
    };
    logger.info('Rate limiter config updated', { newConfig });
  }
}
