import { BrowserManager } from '../utils/BrowserManager';
import { BrowserProfile } from '../utils/browserProfile';
import { Browser, BrowserContext, Page } from 'playwright';
import { AutomationError, ErrorType } from '../utils/errors';

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn()
  }
}));

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  }
}));

// Create a proper mock implementation of AutomationError
class MockAutomationError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AutomationError';
  }
}

jest.mock('../utils/errors', () => ({
  AutomationError: jest.fn().mockImplementation((message: string, type: ErrorType) => {
    return new MockAutomationError(message, type);
  }),
  ErrorType: {
    SETUP_FAILED: 'SETUP_FAILED',
    AUTH_FAILED: 'AUTH_FAILED',
    CAPTCHA: 'CAPTCHA',
  }
}));

describe('BrowserManager', () => {
  let manager: BrowserManager;
  let mockBrowser: jest.Mocked<Browser>;
  let mockContext: jest.Mocked<BrowserContext>;
  let mockPage: jest.Mocked<Page>;
  let mockProfile: BrowserProfile;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock page
    mockPage = {
      close: jest.fn(),
      route: jest.fn(),
      goto: jest.fn(),
    } as unknown as jest.Mocked<Page>;

    // Create mock context
    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
      route: jest.fn(),
      setDefaultTimeout: jest.fn(),
    } as unknown as jest.Mocked<BrowserContext>;

    // Create mock browser
    mockBrowser = {
      newContext: jest.fn().mockResolvedValue(mockContext),
      close: jest.fn(),
    } as unknown as jest.Mocked<Browser>;

    // Create mock profile
    mockProfile = {
      id: 'test-profile',
      userAgent: 'test-agent',
      viewport: { width: 1920, height: 1080 },
      timezone: 'America/New_York',
      geolocation: { latitude: 40.7128, longitude: -74.0060 },
    } as BrowserProfile;

    // Mock chromium.launch
    const chromiumLaunch = require('playwright').chromium.launch;
    chromiumLaunch.mockResolvedValue(mockBrowser);

    // Get BrowserManager instance
    manager = BrowserManager.getInstance();
  });

  afterEach(async () => {
    // Clean up after each test
    await manager.closeAllSessions();
  });

  it('should create a new session successfully', async () => {
    const { browser, page } = await manager.createSession(mockProfile, testUserId);
    expect(browser).toBeDefined();
    expect(page).toBeDefined();
  });

  it('should handle session creation failure', async () => {
    const error = new Error('Browser launch failed');
    require('playwright').chromium.launch.mockRejectedValueOnce(error);

    await expect(manager.createSession(mockProfile, testUserId)).rejects.toThrow(AutomationError);
  });

  it('should check session health', async () => {
    await manager.createSession(mockProfile, testUserId);
    const health = await manager.checkHealth(testUserId);
    expect(health).toBeDefined();
    expect(health?.status).toBe('healthy');
  });

  it('should handle non-existent session health check', async () => {
    const health = await manager.checkHealth('non-existent-user');
    expect(health).toBeNull();
  });

  it('should close session successfully', async () => {
    await manager.createSession(mockProfile, testUserId);
    await expect(manager.closeSession(testUserId)).resolves.not.toThrow();
  });

  it('should handle closing non-existent session', async () => {
    await expect(manager.closeSession('non-existent-user')).resolves.not.toThrow();
  });

  describe('createSession', () => {
    it('should create a new browser session', async () => {
      const { browser, page } = await manager.createSession(mockProfile, testUserId);
      expect(browser).toBe(mockBrowser);
      expect(page).toBe(mockPage);
      expect(mockContext.route).toHaveBeenCalled();
      expect(mockContext.setDefaultTimeout).toHaveBeenCalledWith(30000);
    });

    it('should handle browser launch failures', async () => {
      (require('playwright').chromium.launch as jest.Mock).mockRejectedValue(new Error('Launch failed'));
      
      try {
        await manager.createSession(mockProfile, testUserId);
        fail('Expected createSession to throw');
      } catch (error) {
        if (error instanceof MockAutomationError) {
          expect(error.type).toBe('SETUP_FAILED');
          expect(error.message).toBe('Browser session creation failed');
        } else {
          fail('Expected error to be instance of MockAutomationError');
        }
      }
    });

    it('should handle context creation failures', async () => {
      mockBrowser.newContext.mockRejectedValue(new Error('Context creation failed'));
      
      try {
        await manager.createSession(mockProfile, testUserId);
        fail('Expected createSession to throw');
      } catch (error) {
        if (error instanceof MockAutomationError) {
          expect(error.type).toBe('SETUP_FAILED');
          expect(error.message).toBe('Browser session creation failed');
        } else {
          fail('Expected error to be instance of MockAutomationError');
        }
      }
    });

    it('should set up request interception', async () => {
      const mockRoute = {
        request: jest.fn(),
        abort: jest.fn(),
        continue: jest.fn(),
      };

      await manager.createSession(mockProfile, testUserId);

      // Get the route callback that was passed to context.route
      const routeCallback = (mockContext.route as jest.Mock).mock.calls[0][1];

      // Test image request (should be aborted)
      mockRoute.request.mockReturnValue({ resourceType: () => 'image' });
      routeCallback(mockRoute);
      expect(mockRoute.abort).toHaveBeenCalled();
      expect(mockRoute.continue).not.toHaveBeenCalled();

      // Test font request (should be aborted)
      mockRoute.request.mockReturnValue({ resourceType: () => 'font' });
      routeCallback(mockRoute);
      expect(mockRoute.abort).toHaveBeenCalled();

      // Test stylesheet request (should be aborted)
      mockRoute.request.mockReturnValue({ resourceType: () => 'stylesheet' });
      routeCallback(mockRoute);
      expect(mockRoute.abort).toHaveBeenCalled();

      // Test other request type (should be continued)
      mockRoute.request.mockReturnValue({ resourceType: () => 'xhr' });
      routeCallback(mockRoute);
      expect(mockRoute.continue).toHaveBeenCalled();
    });
  });

  describe('closeSession', () => {
    it('should close an existing session', async () => {
      await manager.createSession(mockProfile, testUserId);
      await manager.closeSession(testUserId);
      expect(mockContext.close).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle non-existent sessions', async () => {
      await expect(manager.closeSession('non-existent')).resolves.not.toThrow();
    });

    it('should handle closure errors', async () => {
      await manager.createSession(mockProfile, testUserId);
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      await expect(manager.closeSession(testUserId)).resolves.not.toThrow();
    });
  });

  describe('closeAllSessions', () => {
    it('should close all active sessions', async () => {
      await manager.createSession(mockProfile, testUserId);
      const secondProfile = {
        id: 'test-profile-2',
        userAgent: 'test-agent-2',
        viewport: { width: 1920, height: 1080 },
        timezone: 'America/New_York',
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
      } as BrowserProfile;
      await manager.createSession(secondProfile, 'test-user-2');
      await manager.closeAllSessions();
      expect(mockContext.close).toHaveBeenCalledTimes(2);
      expect(mockBrowser.close).toHaveBeenCalledTimes(2);
    });

    it('should handle closure errors in multiple sessions', async () => {
      await manager.createSession(mockProfile, testUserId);
      const secondProfile = {
        id: 'test-profile-2',
        userAgent: 'test-agent-2',
        viewport: { width: 1920, height: 1080 },
        timezone: 'America/New_York',
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
      } as BrowserProfile;
      await manager.createSession(secondProfile, 'test-user-2');
      mockContext.close.mockRejectedValue(new Error('Close failed'));
      await expect(manager.closeAllSessions()).resolves.not.toThrow();
    });
  });
});
