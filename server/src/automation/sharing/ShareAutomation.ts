import { Browser, Page } from 'playwright';
import { createBrowserProfile } from '../utils/browserProfile';
import { delay, randomDelay } from '../utils/timing';
import { AutomationError, ErrorType } from '../utils/errors';
import { logger } from '../utils/logger';
import { BrowserManager } from '../utils/BrowserManager';

interface ShareConfig {
  username: string;
  userId: string;  // Added userId for session tracking
  maxItems?: number;
  delayBetweenShares?: [number, number]; // min, max in ms
  retryAttempts?: number;
}

export class ShareAutomation {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn: boolean = false;
  private readonly config: Required<ShareConfig>;
  private readonly browserManager: BrowserManager;

  constructor(config: ShareConfig) {
    this.config = {
      maxItems: 100,
      delayBetweenShares: [3000, 5000],
      retryAttempts: 3,
      ...config
    };
    this.browserManager = BrowserManager.getInstance();
  }

  private async checkSessionHealth(): Promise<boolean> {
    const health = await this.browserManager.checkHealth(this.config.userId);
    if (!health || health.status === 'failed') {
      return false;
    }
    return true;
  }

  async initialize(): Promise<void> {
    let sessionCreated = false;
    try {
      // Check for existing session
      const existingSession = await this.browserManager.getSession(this.config.userId);
      if (existingSession) {
        await this.browserManager.closeSession(this.config.userId);
      }

      const profile = await createBrowserProfile();
      const { browser, page } = await this.browserManager.createSession(profile, this.config.userId);
      sessionCreated = true;
      this.browser = browser;
      this.page = page;

      try {
        await this.login();
      } catch (loginError) {
        await this.cleanup();
        throw loginError;
      }
    } catch (error) {
      logger.error('Failed to initialize share automation', { error, userId: this.config.userId });
      // Only cleanup if session was created
      if (sessionCreated) {
        await this.cleanup();
      }
      if (error instanceof AutomationError) {
        throw error;
      }
      throw new AutomationError('Initialization failed', ErrorType.SETUP_FAILED);
    }
  }

  async login(): Promise<void> {
    if (!this.page) throw new AutomationError('Page not initialized', ErrorType.SETUP_FAILED);

    try {
      await this.page.goto('https://poshmark.com/login');
      await this.page.fill('input[name="login_form[username_email]"]', this.config.username);
      await this.page.fill('input[name="login_form[password]"]', process.env.POSHMARK_PASSWORD || '');
      await this.page.click('button[type="submit"]');

      // Wait for login to complete
      await this.page.waitForNavigation({ waitUntil: 'networkidle' });

      // Check for CAPTCHA
      const captcha = await this.page.$('[data-testid="captcha"]');
      if (captcha && await captcha.isVisible()) {
        throw new AutomationError('CAPTCHA detected', ErrorType.CAPTCHA);
      }

      // Verify login success
      const loggedIn = await this.page.$('[data-testid="user-profile"]');
      if (!loggedIn || !(await loggedIn.isVisible())) {
        throw new AutomationError('Login failed', ErrorType.AUTH_FAILED);
      }

      this.isLoggedIn = true;
      logger.info('Successfully logged in to Poshmark', { userId: this.config.userId });
    } catch (error) {
      logger.error('Login failed', { error, userId: this.config.userId });
      if (error instanceof AutomationError) {
        throw error;
      }
      throw new AutomationError('Login failed', ErrorType.AUTH_FAILED);
    }
  }

  async shareCloset(): Promise<number> {
    if (!this.isLoggedIn || !this.page) {
      throw new AutomationError('Not logged in', ErrorType.AUTH_FAILED);
    }

    // Check session health before proceeding
    if (!await this.checkSessionHealth()) {
      logger.warn('Unhealthy session detected, attempting recovery', { userId: this.config.userId });
      await this.cleanup();
      await this.initialize();
    }

    let sharedCount = 0;
    try {
      // Navigate to closet
      await this.page.goto(`https://poshmark.com/closet/${this.config.username}`);
      await this.page.waitForSelector('[data-testid="closet-items"]');

      // Get all items
      const items = await this.page.$$('[data-testid="closet-item"]');
      const itemsToShare = items.slice(0, this.config.maxItems);

      for (const item of itemsToShare) {
        try {
          // Find and click the share button
          const shareButton = await item.$('[data-testid="share-button"]');
          if (shareButton) {
            await shareButton.click();
            sharedCount++;
            await this.randomDelay(
              this.config.delayBetweenShares[0],
              this.config.delayBetweenShares[1]
            );
          }
        } catch (error) {
          logger.warn(`Failed to share item ${sharedCount + 1}`, { 
            error,
            userId: this.config.userId 
          });
          continue;
        }
      }

      return sharedCount;
    } catch (error) {
      logger.error('Share automation failed', { error, userId: this.config.userId });
      throw new AutomationError(
        'Share automation failed',
        error instanceof AutomationError ? error.type : ErrorType.UNKNOWN
      );
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.browserManager.closeSession(this.config.userId);
      this.browser = null;
      this.page = null;
    } catch (error) {
      logger.error('Cleanup failed', { error, userId: this.config.userId });
    } finally {
      this.isLoggedIn = false;
    }
  }

  private async randomDelay(min: number = 1000, max: number = 3000): Promise<void> {
    const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
    await delay(randomTime);
  }
}
