"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareAutomation = void 0;
const browserProfile_1 = require("../utils/browserProfile");
const timing_1 = require("../utils/timing");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const BrowserManager_1 = require("../utils/BrowserManager");
class ShareAutomation {
    constructor(config) {
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
        this.config = {
            maxItems: 100,
            delayBetweenShares: [3000, 5000],
            retryAttempts: 3,
            ...config
        };
        this.browserManager = BrowserManager_1.BrowserManager.getInstance();
    }
    async checkSessionHealth() {
        const health = await this.browserManager.checkHealth(this.config.userId);
        if (!health || health.status === 'failed') {
            return false;
        }
        return true;
    }
    async initialize() {
        let sessionCreated = false;
        try {
            // Check for existing session
            const existingSession = await this.browserManager.getSession(this.config.userId);
            if (existingSession) {
                await this.browserManager.closeSession(this.config.userId);
            }
            const profile = await (0, browserProfile_1.createBrowserProfile)();
            const { browser, page } = await this.browserManager.createSession(profile, this.config.userId);
            sessionCreated = true;
            this.browser = browser;
            this.page = page;
            try {
                await this.login();
            }
            catch (loginError) {
                await this.cleanup();
                throw loginError;
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to initialize share automation', { error, userId: this.config.userId });
            // Only cleanup if session was created
            if (sessionCreated) {
                await this.cleanup();
            }
            if (error instanceof errors_1.AutomationError) {
                throw error;
            }
            throw new errors_1.AutomationError('Initialization failed', errors_1.ErrorType.SETUP_FAILED);
        }
    }
    async login() {
        if (!this.page)
            throw new errors_1.AutomationError('Page not initialized', errors_1.ErrorType.SETUP_FAILED);
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
                throw new errors_1.AutomationError('CAPTCHA detected', errors_1.ErrorType.CAPTCHA);
            }
            // Verify login success
            const loggedIn = await this.page.$('[data-testid="user-profile"]');
            if (!loggedIn || !(await loggedIn.isVisible())) {
                throw new errors_1.AutomationError('Login failed', errors_1.ErrorType.AUTH_FAILED);
            }
            this.isLoggedIn = true;
            logger_1.logger.info('Successfully logged in to Poshmark', { userId: this.config.userId });
        }
        catch (error) {
            logger_1.logger.error('Login failed', { error, userId: this.config.userId });
            if (error instanceof errors_1.AutomationError) {
                throw error;
            }
            throw new errors_1.AutomationError('Login failed', errors_1.ErrorType.AUTH_FAILED);
        }
    }
    async shareCloset() {
        if (!this.isLoggedIn || !this.page) {
            throw new errors_1.AutomationError('Not logged in', errors_1.ErrorType.AUTH_FAILED);
        }
        // Check session health before proceeding
        if (!await this.checkSessionHealth()) {
            logger_1.logger.warn('Unhealthy session detected, attempting recovery', { userId: this.config.userId });
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
                        await this.randomDelay(this.config.delayBetweenShares[0], this.config.delayBetweenShares[1]);
                    }
                }
                catch (error) {
                    logger_1.logger.warn(`Failed to share item ${sharedCount + 1}`, {
                        error,
                        userId: this.config.userId
                    });
                    continue;
                }
            }
            return sharedCount;
        }
        catch (error) {
            logger_1.logger.error('Share automation failed', { error, userId: this.config.userId });
            throw new errors_1.AutomationError('Share automation failed', error instanceof errors_1.AutomationError ? error.type : errors_1.ErrorType.UNKNOWN);
        }
    }
    async cleanup() {
        try {
            await this.browserManager.closeSession(this.config.userId);
            this.browser = null;
            this.page = null;
        }
        catch (error) {
            logger_1.logger.error('Cleanup failed', { error, userId: this.config.userId });
        }
        finally {
            this.isLoggedIn = false;
        }
    }
    async randomDelay(min = 1000, max = 3000) {
        const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
        await (0, timing_1.delay)(randomTime);
    }
}
exports.ShareAutomation = ShareAutomation;
