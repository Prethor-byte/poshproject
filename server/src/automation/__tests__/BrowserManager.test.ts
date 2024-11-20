import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { BrowserManager } from '../utils/BrowserManager';
import { AutomationError, ErrorType } from '../utils/errors';

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('BrowserManager', () => {
  let browserManager: BrowserManager;
  let mockBrowser: jest.Mocked<Browser>;
  let mockContext: jest.Mocked<BrowserContext>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockContext = {
      newPage: jest.fn(),
      close: jest.fn(),
      setDefaultTimeout: jest.fn(),
      route: jest.fn(),
    } as unknown as jest.Mocked<BrowserContext>;

    mockBrowser = {
      newContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn(),
    } as unknown as jest.Mocked<Browser>;

    browserManager = BrowserManager.getInstance();
  });

  describe('createSession', () => {
    it('should create a new browser session', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

      const profile = {
        id: 'test-profile',
        userAgent: 'test-agent',
        viewport: { width: 1920, height: 1080 },
        timezone: 'America/New_York',
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
      };

      const { browser, page } = await browserManager.createSession(profile);

      expect(chromium.launch).toHaveBeenCalledWith({
        headless: false,
        args: [
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
        ],
      });

      expect(browser).toBeDefined();
      expect(page).toBeDefined();
      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        userAgent: profile.userAgent,
        viewport: profile.viewport,
        locale: 'en-US',
        timezoneId: profile.timezone,
        geolocation: profile.geolocation,
        permissions: ['geolocation'],
      });
    });

    it('should handle browser launch failures', async () => {
      (chromium.launch as jest.Mock).mockRejectedValue(new Error('Launch failed'));

      await expect(browserManager.createSession({} as any))
        .rejects
        .toThrow(new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED));
    });

    it('should handle context creation failures', async () => {
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);
      mockBrowser.newContext.mockRejectedValue(new Error('Context creation failed'));

      await expect(browserManager.createSession({} as any))
        .rejects
        .toThrow(new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED));
    });

    it('should set up request interception', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

      await browserManager.createSession({} as any);

      expect(mockContext.route).toHaveBeenCalled();
    });
  });

  describe('closeSession', () => {
    it('should close an existing session', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

      await browserManager.createSession({ id: 'test' } as any);
      await browserManager.closeSession('test');

      expect(mockContext.close).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle non-existent sessions', async () => {
      await expect(browserManager.closeSession('non-existent'))
        .resolves
        .not
        .toThrow();
    });

    it('should handle closure errors', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      mockBrowser.close.mockRejectedValue(new Error('Close failed'));

      await browserManager.createSession({ id: 'test' } as any);
      await expect(browserManager.closeSession('test'))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('closeAllSessions', () => {
    it('should close all active sessions', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

      // Create multiple sessions
      await browserManager.createSession({ id: 'test1' } as any);
      await browserManager.createSession({ id: 'test2' } as any);

      await browserManager.closeAllSessions();

      expect(mockContext.close).toHaveBeenCalledTimes(2);
      expect(mockBrowser.close).toHaveBeenCalledTimes(2);
    });

    it('should handle closure errors in multiple sessions', async () => {
      const mockPage = { goto: jest.fn() } as unknown as Page;
      mockContext.newPage.mockResolvedValue(mockPage);
      (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      mockBrowser.close.mockRejectedValue(new Error('Close failed'));

      // Create multiple sessions
      await browserManager.createSession({ id: 'test1' } as any);
      await browserManager.createSession({ id: 'test2' } as any);

      await expect(browserManager.closeAllSessions())
        .resolves
        .not
        .toThrow();
    });
  });
});
