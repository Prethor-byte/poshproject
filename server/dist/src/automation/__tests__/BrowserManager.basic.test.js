"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const BrowserManager_1 = require("../utils/BrowserManager");
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn(),
    },
}));
describe('BrowserManager', () => {
    let browserManager;
    const testUserId = 'test-user-123';
    beforeEach(() => {
        jest.clearAllMocks();
        browserManager = BrowserManager_1.BrowserManager.getInstance();
    });
    it('should be a singleton', () => {
        const instance1 = BrowserManager_1.BrowserManager.getInstance();
        const instance2 = BrowserManager_1.BrowserManager.getInstance();
        expect(instance1).toBe(instance2);
    });
    it('should launch browser with correct options', async () => {
        const mockBrowser = {
            newContext: jest.fn().mockResolvedValue({
                newPage: jest.fn().mockResolvedValue({}),
                close: jest.fn(),
                setDefaultTimeout: jest.fn(),
                route: jest.fn(),
            }),
            close: jest.fn(),
        };
        playwright_1.chromium.launch.mockResolvedValue(mockBrowser);
        const profile = {
            id: 'test-profile',
            userAgent: 'test-agent',
            viewport: { width: 1920, height: 1080 },
            timezone: 'America/New_York',
            geolocation: { latitude: 40.7128, longitude: -74.0060 },
        };
        await browserManager.createSession(profile, testUserId);
        expect(playwright_1.chromium.launch).toHaveBeenCalledWith({
            headless: false,
            args: [
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-software-rasterizer',
            ],
        });
    });
});
