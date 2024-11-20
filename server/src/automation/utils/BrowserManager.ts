import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { BrowserProfile } from './browserProfile';
import { logger } from './logger';
import { AutomationError, ErrorType } from './errors';

export class BrowserManager {
  private static instance: BrowserManager;
  private activeSessions: Map<string, { browser: Browser; context: BrowserContext }> = new Map();

  static getInstance(): BrowserManager {
    if (!BrowserManager.instance) {
      BrowserManager.instance = new BrowserManager();
    }
    return BrowserManager.instance;
  }

  async createSession(profile: BrowserProfile): Promise<{ browser: Browser; page: Page }> {
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

      // Store the session
      this.activeSessions.set(profile.id, { browser, context });

      return { browser, page };
    } catch (error) {
      logger.error('Failed to create browser session', { error });
      throw new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED);
    }
  }

  async closeSession(profileId: string): Promise<void> {
    const session = this.activeSessions.get(profileId);
    if (session) {
      try {
        await session.context.close();
        await session.browser.close();
        this.activeSessions.delete(profileId);
      } catch (error) {
        logger.error('Failed to close browser session', { error, profileId });
      }
    }
  }

  async closeAllSessions(): Promise<void> {
    const closePromises = Array.from(this.activeSessions.entries()).map(([profileId]) => 
      this.closeSession(profileId)
    );
    await Promise.all(closePromises);
  }
}
