"use strict";
// Mock Playwright
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn(),
    },
}));
// Mock Winston logger
jest.mock('../automation/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
    },
}));
beforeAll(() => {
    // Set up test environment variables
    process.env.POSHMARK_PASSWORD = 'test-password';
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'error';
});
afterAll(async () => {
    // Clean up any remaining browser sessions
    const { BrowserManager } = require('../automation/utils/BrowserManager');
    const manager = BrowserManager.getInstance();
    if (manager && typeof manager.closeAllSessions === 'function') {
        await manager.closeAllSessions();
    }
});
