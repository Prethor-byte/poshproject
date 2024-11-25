import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { BrowserProfile } from './browserProfile';
import { logger } from './logger';
import { AutomationError, ErrorType } from './errors';

interface SessionHealth {
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: Date;
  errors: Array<{
    type: ErrorType;
    timestamp: Date;
    message: string;
  }>;
  lastUsed: Date;
  recoveryAttempts: number;
}

interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  profile: BrowserProfile;
  userId: string;
  health: SessionHealth;
}

export class BrowserManager {
  private static instance: BrowserManager;
  private sessions: Map<string, BrowserSession> = new Map();

  private constructor() {}

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
      errors: [],
      lastUsed: new Date(),
      recoveryAttempts: 0
    };
  }

  private async checkSessionHealth(session: BrowserSession): Promise<void> {
    try {
      const page = await session.context.newPage();
      await page.close();
      
      session.health.status = 'healthy';
      session.health.lastCheck = new Date();
    } catch (error) {
      session.health.status = 'degraded';
      session.health.errors.push({
        type: error instanceof AutomationError ? error.type : ErrorType.UNKNOWN,
        timestamp: new Date(),
        message: error.message
      });

      if (session.health.errors.length > 3) {
        session.health.status = 'failed';
      }
    }
  }

  async createSession(profile: BrowserProfile, userId: string): Promise<{ browser: Browser; page: Page }> {
    try {
      const browser = await chromium.launch({
        headless: process.env.NODE_ENV === 'production',
        args: [
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
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

      // Set default timeout
      context.setDefaultTimeout(30000);

      // Enable request interception for better control
      await context.route('**/*', (route) => {
        const request = route.request();
        // Block unnecessary resources
        if (['image', 'font', 'stylesheet'].includes(request.resourceType())) {
          route.abort();
        } else {
          route.continue();
        }
      });

      const page = await context.newPage();

      // Create and store session with health tracking
      const session: BrowserSession = {
        browser,
        context,
        profile,
        userId,
        health: this.createHealthCheck()
      };

      this.sessions.set(userId, session);

      return { browser, page };
    } catch (error) {
      logger.error('Failed to create browser session', { error, userId });
      throw new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED);
    }
  }

  async getSession(userId: string): Promise<BrowserSession | null> {
    const session = this.sessions.get(userId);
    if (!session) return null;

    // Update last used timestamp
    session.health.lastUsed = new Date();
    return session;
  }

  async closeSession(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      try {
        await session.context.close();
        await session.browser.close();
        this.sessions.delete(userId);
      } catch (error) {
        logger.error('Failed to close browser session', { error, userId });
      }
    }
  }

  async closeAllSessions(): Promise<void> {
    const closePromises = Array.from(this.sessions.values()).map(session => 
      this.closeSession(session.userId)
    );
    await Promise.all(closePromises);
  }

  async checkHealth(userId: string): Promise<SessionHealth | null> {
    const session = await this.getSession(userId);
    if (!session) return null;

    await this.checkSessionHealth(session);
    return session.health;
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
}
