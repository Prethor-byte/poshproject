import { Browser, BrowserContext, chromium } from 'playwright';
import { BrowserManager } from '../utils/BrowserManager';
import { BrowserProfile } from '../utils/browserProfile';
import { AutomationError, ErrorType } from '../utils/errors';

// Mock Playwright
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('BrowserManager', () => {
  let browserManager: BrowserManager;
  let mockBrowser: jest.Mocked<Browser>;
  let mockContext: jest.Mocked<BrowserContext>;
  let mockProfile: BrowserProfile;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock browser and context
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

    // Mock chromium.launch
    (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

    // Create test profile
    mockProfile = {
      id: 'test-profile',
      userAgent: 'test-agent',
      viewport: { width: 1920, height: 1080 },
      timezone: 'America/New_York',
      geolocation: { latitude: 40.7128, longitude: -74.0060 },
    };

    // Initialize BrowserManager
    browserManager = BrowserManager.getInstance();
  });

  describe('createSession', () => {
    it('should create a new browser session', async () => {
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);

      const { browser, page } = await browserManager.createSession(mockProfile);

      expect(chromium.launch).toHaveBeenCalledWith({
        headless: true,
        args: expect.arrayContaining([
          '--disable-dev-shm-usage',
          '--no-sandbox',
        ]),
      });

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        userAgent: mockProfile.userAgent,
        viewport: mockProfile.viewport,
        locale: 'en-US',
        timezoneId: mockProfile.timezone,
        geolocation: mockProfile.geolocation,
        permissions: ['geolocation'],
      });

      expect(browser).toBeDefined();
      expect(page).toBeDefined();
    });

    it('should handle browser launch failures', async () => {
      (chromium.launch as jest.Mock).mockRejectedValue(new Error('Launch failed'));

      await expect(browserManager.createSession(mockProfile))
        .rejects
        .toThrow(new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED));
    });

    it('should handle context creation failures', async () => {
      mockBrowser.newContext.mockRejectedValue(new Error('Context creation failed'));

      await expect(browserManager.createSession(mockProfile))
        .rejects
        .toThrow(new AutomationError('Browser session creation failed', ErrorType.SETUP_FAILED));
    });

    it('should set up request interception', async () => {
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);

      await browserManager.createSession(mockProfile);

      expect(mockContext.route).toHaveBeenCalled();
    });
  });

  describe('closeSession', () => {
    it('should close an existing session', async () => {
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);

      await browserManager.createSession(mockProfile);
      await browserManager.closeSession(mockProfile.id);

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
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      mockBrowser.close.mockRejectedValue(new Error('Close failed'));

      await browserManager.createSession(mockProfile);
      await expect(browserManager.closeSession(mockProfile.id))
        .resolves
        .not
        .toThrow();
    });
  });

  describe('closeAllSessions', () => {
    it('should close all active sessions', async () => {
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);

      // Create multiple sessions
      await browserManager.createSession({ ...mockProfile, id: 'profile1' });
      await browserManager.createSession({ ...mockProfile, id: 'profile2' });

      await browserManager.closeAllSessions();

      expect(mockContext.close).toHaveBeenCalledTimes(2);
      expect(mockBrowser.close).toHaveBeenCalledTimes(2);
    });

    it('should handle closure errors in multiple sessions', async () => {
      const mockPage = { goto: jest.fn() };
      mockContext.newPage.mockResolvedValue(mockPage as any);
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      mockBrowser.close.mockRejectedValue(new Error('Close failed'));

      // Create multiple sessions
      await browserManager.createSession({ ...mockProfile, id: 'profile1' });
      await browserManager.createSession({ ...mockProfile, id: 'profile2' });

      await expect(browserManager.closeAllSessions())
        .resolves
        .not
        .toThrow();
    });
  });
});
