"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserManager = void 0;
const playwright_1 = require("playwright");
const logger_1 = require("./logger");
const errors_1 = require("./errors");
class BrowserManager {
    constructor() {
        this.sessions = new Map();
    }
    static getInstance() {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }
    createHealthCheck() {
        return {
            status: 'healthy',
            lastCheck: new Date(),
            errors: [],
            lastUsed: new Date(),
            recoveryAttempts: 0
        };
    }
    async checkSessionHealth(session) {
        try {
            const page = await session.context.newPage();
            await page.close();
            session.health.status = 'healthy';
            session.health.lastCheck = new Date();
        }
        catch (error) {
            session.health.status = 'degraded';
            session.health.errors.push({
                type: error instanceof errors_1.AutomationError ? error.type : errors_1.ErrorType.UNKNOWN,
                timestamp: new Date(),
                message: error instanceof Error ? error.message : String(error)
            });
            if (session.health.errors.length > 3) {
                session.health.status = 'failed';
            }
        }
    }
    async handleError(error, message) {
        logger_1.logger.error(message, { error: error instanceof Error ? error.message : String(error) });
        throw new errors_1.AutomationError(message, error instanceof errors_1.AutomationError ? error.type : errors_1.ErrorType.UNKNOWN);
    }
    async createSession(profile, userId) {
        try {
            const browser = await playwright_1.chromium.launch({
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
            // Block unnecessary resources
            await context.route('**/*', async (route) => {
                const resourceType = route.request().resourceType();
                if (['image', 'font', 'stylesheet'].includes(resourceType)) {
                    await route.abort();
                }
                else {
                    await route.continue();
                }
            });
            const page = await context.newPage();
            const session = {
                browser,
                context,
                profile,
                userId,
                health: this.createHealthCheck()
            };
            this.sessions.set(userId, session);
            return { browser, page };
        }
        catch (error) {
            return await this.handleError(error, 'Failed to create browser session');
        }
    }
    async getSession(userId) {
        const session = this.sessions.get(userId);
        if (!session)
            return null;
        // Update last used timestamp
        session.health.lastUsed = new Date();
        return session;
    }
    async closeSession(userId) {
        const session = this.sessions.get(userId);
        if (session) {
            try {
                await session.context.close();
                await session.browser.close();
                this.sessions.delete(userId);
            }
            catch (error) {
                await this.handleError(error, 'Failed to close browser session');
            }
        }
    }
    async closeAllSessions() {
        const closePromises = Array.from(this.sessions.values()).map(session => this.closeSession(session.userId));
        await Promise.all(closePromises);
    }
    async checkHealth(userId) {
        const session = await this.getSession(userId);
        if (!session)
            return null;
        await this.checkSessionHealth(session);
        return session.health;
    }
    async cleanupInactiveSessions(maxInactiveTime = 30 * 60 * 1000) {
        const now = new Date();
        for (const [userId, session] of this.sessions.entries()) {
            const inactiveTime = now.getTime() - session.health.lastUsed.getTime();
            if (inactiveTime > maxInactiveTime) {
                await this.closeSession(userId);
            }
        }
    }
}
exports.BrowserManager = BrowserManager;
