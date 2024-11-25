import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { BrowserProfile } from './browserProfile';
import { logger } from './logger';
import { AutomationError, ErrorType } from './errors';
import { BrowserSession, SessionHealth, OperationMetrics, SessionStatus } from './types';
import { RetryManager } from './RetryManager';
import { RateLimiter } from './RateLimiter';

export class BrowserManager {
  private static instance: BrowserManager;
  private sessions: Map<string, BrowserSession>;
  private monitoringIntervals: Map<string, NodeJS.Timeout>;
  private retryManager: RetryManager;
  private rateLimiter: RateLimiter;
  private monitorInterval?: NodeJS.Timeout;

  private constructor() {
    this.sessions = new Map();
    this.monitoringIntervals = new Map();
    this.retryManager = new RetryManager();
    this.rateLimiter = RateLimiter.getInstance();
    this.startMonitoring();
  }

  static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  private createHealthCheck(): SessionHealth {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      lastUsed: new Date(),
      errors: [],
      recoveryAttempts: 0,
      metrics: {
        totalOperations: 0,
        failedOperations: 0,
        averageResponseTime: 0,
        lastResponseTime: 0
      }
    };
  }

  private async monitorSessions(): Promise<void> {
    for (const [userId, session] of this.sessions.entries()) {
      try {
        await this.checkSessionHealth(session);
        
        if (session.health.status === 'failed') {
          const recovered = await this.recoverSession(userId);
          if (!recovered) {
            await this.closeSession(userId);
          }
        }
      } catch (error) {
        logger.error('Session monitoring failed', {
          error,
          userId,
          sessionId: session.profile.id
        });
      }
    }
  }

  private startMonitoring(): void {
    // Clear any existing interval
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    // Start health check interval
    this.monitorInterval = setInterval(() => this.monitorSessions(), 60000);
  }

  public stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = undefined;
    }
  }

  private async recoverSession(userId: string): Promise<boolean> {
    const session = this.sessions.get(userId);
    if (!session) return false;

    session.health.recoveryAttempts++;

    if (session.health.recoveryAttempts >= 3) {
      logger.error('Max recovery attempts reached, session will be terminated', {
        userId,
        sessionId: session.profile.id
      });
      await this.closeSession(userId);
      return false;
    }

    try {
      // Close existing session resources
      await Promise.all([
        session.context.close().catch(() => {}),
        session.browser.close().catch(() => {})
      ]);

      // Create new session
      const { browser, context } = await this.retryManager.executeWithBackoff(
        async () => {
          const browser = await chromium.launch({
            headless: process.env.NODE_ENV === 'production',
            args: [
              '--disable-dev-shm-usage',
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-gpu'
            ]
          });

          const context = await browser.newContext({
            userAgent: session.profile.userAgent,
            viewport: session.profile.viewport,
            locale: 'en-US',
            timezoneId: session.profile.timezone,
            geolocation: session.profile.geolocation,
            permissions: ['geolocation']
          });

          return { browser, context };
        }
      );

      // Update session with new browser and context
      session.browser = browser;
      session.context = context;
      session.health.status = 'healthy';
      session.health.lastCheck = new Date();
      session.health.errors = [];

      logger.info('Session recovered successfully', {
        userId,
        sessionId: session.profile.id,
        attempts: session.health.recoveryAttempts
      });

      return true;
    } catch (error) {
      logger.error('Session recovery failed', {
        error,
        userId,
        sessionId: session.profile.id
      });
      await this.closeSession(userId);
      return false;
    }
  }

  private async checkSessionHealth(session: BrowserSession): Promise<void> {
    try {
      const startTime = Date.now();
      const page = await session.context.newPage();
      await page.close();
      
      const duration = Date.now() - startTime;
      await this.updateSessionMetrics(session.userId, {
        operationDuration: duration,
        success: true
      });
      
      session.health.lastCheck = new Date();
    } catch (error) {
      const errorType = error instanceof AutomationError ? error.type : ErrorType.UNKNOWN;
      const recoverable = error instanceof AutomationError ? error.recoverable : true;
      
      session.health.errors.push({
        type: errorType,
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        recoverable
      });

      await this.updateSessionMetrics(session.userId, {
        operationDuration: 0,
        success: false,
        errorType
      });

      this.updateHealthStatus(session);
    }
  }

  async updateSessionMetrics(userId: string, metrics: OperationMetrics): Promise<void> {
    const session = await this.getSession(userId);
    if (!session) return;

    const { metrics: sessionMetrics } = session.health;
    sessionMetrics.totalOperations++;
    
    if (!metrics.success) {
      sessionMetrics.failedOperations++;
    }

    // Update response time metrics
    const { operationDuration } = metrics;
    sessionMetrics.lastResponseTime = operationDuration;
    
    if (sessionMetrics.totalOperations === 1) {
      sessionMetrics.averageResponseTime = operationDuration;
    } else {
      sessionMetrics.averageResponseTime = (
        (sessionMetrics.averageResponseTime * (sessionMetrics.totalOperations - 1) + operationDuration) /
        sessionMetrics.totalOperations
      );
    }

    this.updateHealthStatus(session);
  }

  private updateHealthStatus(session: BrowserSession): void {
    const { metrics, errors } = session.health;
    const failureRate = metrics.totalOperations > 0 ? 
      metrics.failedOperations / metrics.totalOperations : 0;
    const hasRecentErrors = errors.some(
      error => Date.now() - error.timestamp.getTime() < 5 * 60 * 1000 // 5 minutes
    );

    if (failureRate >= 0.5 || errors.length >= 5) {
      session.health.status = 'failed';
    } else if (failureRate >= 0.2 || hasRecentErrors) {
      session.health.status = 'degraded';
    } else {
      session.health.status = 'healthy';
    }
  }

  async createSession(profile: BrowserProfile, userId: string): Promise<{ browser: Browser; page: Page }> {
    if (!await this.rateLimiter.acquireToken(userId)) {
      const info = this.rateLimiter.getRateLimitInfo(userId);
      throw new Error(`Rate limit exceeded. Try again after ${info.nextResetTime.toISOString()}`);
    }

    try {
      const browser = await chromium.launch({
        headless: process.env.NODE_ENV === 'production',
        args: [
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu'
        ]
      });

      const context = await browser.newContext({
        userAgent: profile.userAgent,
        viewport: profile.viewport,
        locale: 'en-US',
        timezoneId: profile.timezone,
        geolocation: profile.geolocation,
        permissions: ['geolocation']
      });

      context.setDefaultTimeout(30000);

      // Block unnecessary resources
      await context.route('**/*', async (route) => {
        const resourceType = route.request().resourceType();
        if (['image', 'font', 'stylesheet'].includes(resourceType)) {
          await route.abort();
        } else {
          await route.continue();
        }
      });

      const page = await context.newPage();

      const session: BrowserSession = {
        browser,
        context,
        profile,
        userId,
        health: this.createHealthCheck(),
        createdAt: new Date()
      };

      this.sessions.set(userId, session);

      return { browser, page };
    } catch (error) {
      logger.error('Failed to create browser session', { error });
      throw new AutomationError(
        'Browser session creation failed',
        ErrorType.SETUP_FAILED,
        true
      );
    } finally {
      this.rateLimiter.releaseToken(userId);
    }
  }

  async getSession(userId: string): Promise<BrowserSession | null> {
    const session = this.sessions.get(userId);
    if (!session) return null;

    // Update last used timestamp
    session.health.lastUsed = new Date();
    return session;
  }

  async checkHealth(userId: string): Promise<SessionHealth | null> {
    const session = await this.getSession(userId);
    if (!session) return null;

    await this.checkSessionHealth(session);
    
    if (session.health.status === 'failed') {
      const recovered = await this.recoverSession(userId);
      if (!recovered) {
        await this.closeSession(userId);
        return null;
      }
    }

    return session.health;
  }

  async closeSession(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      try {
        await Promise.all([
          session.context.close().catch(() => {}),
          session.browser.close().catch(() => {})
        ]);
      } catch (error) {
        logger.error('Failed to close browser session', { error });
      } finally {
        this.sessions.delete(userId);
      }
    }
  }

  async closeAllSessions(): Promise<void> {
    this.stopMonitoring();
    const closePromises = Array.from(this.sessions.keys()).map(userId => 
      this.closeSession(userId)
    );
    await Promise.allSettled(closePromises);
  }

  async cleanupInactiveSessions(maxInactiveTime: number = 30 * 60 * 1000): Promise<void> {
    const now = new Date();
    for (const [userId, session] of this.sessions.entries()) {
      const inactiveTime = now.getTime() - session.health.lastUsed.getTime();
      if (inactiveTime > maxInactiveTime) {
        await this.closeSession(userId);
      }
    }
  }

  async performAction<T>(userId: string, action: () => Promise<T>): Promise<T> {
    if (!await this.rateLimiter.acquireToken(userId)) {
      const info = this.rateLimiter.getRateLimitInfo(userId);
      throw new Error(`Rate limit exceeded. Try again after ${info.nextResetTime.toISOString()}`);
    }

    try {
      return await action();
    } finally {
      this.rateLimiter.releaseToken(userId);
    }
  }
}
