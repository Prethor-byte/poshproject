import { Browser, BrowserContext, Page, ElementHandle } from 'playwright';
import { ShareAutomation } from '../sharing/ShareAutomation';
import { BrowserManager } from '../utils/BrowserManager';
import { AutomationError, ErrorType } from '../utils/errors';

jest.mock('../utils/BrowserManager');
jest.mock('../utils/logger');

describe('ShareAutomation', () => {
  let shareAutomation: ShareAutomation;
  let mockBrowser: jest.Mocked<Browser>;
  let mockPage: jest.Mocked<Page>;
  const testUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock browser and page
    mockPage = {
      goto: jest.fn(),
      fill: jest.fn(),
      click: jest.fn(),
      waitForNavigation: jest.fn(),
      waitForSelector: jest.fn(),
      $: jest.fn(),
      $$: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<Page>;

    mockBrowser = {
      close: jest.fn(),
      newPage: jest.fn().mockResolvedValue(mockPage),
    } as unknown as jest.Mocked<Browser>;

    // Mock BrowserManager
    (BrowserManager.getInstance as jest.Mock).mockReturnValue({
      createSession: jest.fn().mockResolvedValue({ browser: mockBrowser, page: mockPage }),
      checkHealth: jest.fn().mockResolvedValue({ status: 'healthy' }),
      closeSession: jest.fn(),
    });

    // Create ShareAutomation instance with userId
    shareAutomation = new ShareAutomation({
      username: 'testuser',
      userId: testUserId,
      maxItems: 5,
      delayBetweenShares: [1000, 2000],
    });
  });

  describe('initialize', () => {
    it('should successfully initialize and login', async () => {
      // Mock successful login
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return null;
        }
        if (selector === '[data-testid="user-profile"]') {
          return { isVisible: () => Promise.resolve(true) } as unknown as ElementHandle;
        }
        return null;
      });

      await expect(shareAutomation.initialize()).resolves.not.toThrow();
    });

    it('should handle CAPTCHA detection', async () => {
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return { isVisible: () => Promise.resolve(true) } as unknown as ElementHandle;
        }
        return null;
      });

      await expect(shareAutomation.initialize()).rejects.toThrow(AutomationError);
    });

    it('should handle login failure', async () => {
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return null;
        }
        if (selector === '[data-testid="user-profile"]') {
          return { isVisible: () => Promise.resolve(false) } as unknown as ElementHandle;
        }
        return null;
      });

      await expect(shareAutomation.initialize()).rejects.toThrow(
        new AutomationError('Login failed', ErrorType.AUTH_FAILED)
      );
    });

    it('should handle browser creation failure', async () => {
      // Mock BrowserManager.createSession to throw immediately
      const mockBrowserManager = {
        createSession: jest.fn().mockRejectedValue(new Error('Failed to create browser')),
      };
      (BrowserManager.getInstance as jest.Mock).mockReturnValue(mockBrowserManager);

      // Mock page and browser to verify they're not used
      const mockPage = { close: jest.fn() };
      const mockBrowser = { close: jest.fn() };

      // Create a new instance for this test to avoid interference
      const localShareAutomation = new ShareAutomation({ username: 'testuser', userId: testUserId });

      await expect(localShareAutomation.initialize()).rejects.toThrow(
        'Initialization failed'
      );

      expect(mockBrowserManager.createSession).toHaveBeenCalled();
      expect(mockPage.close).not.toHaveBeenCalled();
      expect(mockBrowser.close).not.toHaveBeenCalled();
    });

    it('should handle navigation failure', async () => {
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return null;
        }
        if (selector === '[data-testid="user-profile"]') {
          return { isVisible: () => Promise.resolve(true) } as unknown as ElementHandle;
        }
        return null;
      });

      mockPage.goto.mockRejectedValueOnce(new Error('Navigation failed'));

      await expect(shareAutomation.initialize()).rejects.toThrow(
        new AutomationError('Login failed', ErrorType.AUTH_FAILED)
      );
    });
  });

  describe('shareCloset', () => {
    beforeEach(async () => {
      // Mock successful login
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return null;
        }
        if (selector === '[data-testid="user-profile"]') {
          return { isVisible: () => Promise.resolve(true) } as unknown as ElementHandle;
        }
        return null;
      });

      await shareAutomation.initialize();
    });

    it('should share items successfully', async () => {
      const mockItems = Array(5).fill(null).map(() => ({
        $: jest.fn().mockResolvedValue({
          click: jest.fn().mockResolvedValue(undefined)
        })
      } as unknown as ElementHandle<SVGElement | HTMLElement>));

      mockPage.$$.mockResolvedValue(mockItems);

      await expect(shareAutomation.shareCloset()).resolves.toBe(5);
    });

    it('should handle sharing errors gracefully', async () => {
      const mockItems = [{
        $: jest.fn().mockRejectedValue(new Error('Share failed'))
      } as unknown as ElementHandle<SVGElement | HTMLElement>];

      mockPage.$$.mockResolvedValue(mockItems);

      await expect(shareAutomation.shareCloset()).resolves.toBe(0);
    });

    it('should handle empty closet', async () => {
      mockPage.$$.mockResolvedValue([]);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(0);
    });

    it('should handle sharing errors', async () => {
      const mockItems = [{
        $: jest.fn().mockResolvedValue({
          click: jest.fn().mockRejectedValue(new Error('Failed to share item')),
        }),
      } as unknown as ElementHandle<SVGElement | HTMLElement>];

      mockPage.$$.mockResolvedValue(mockItems);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(0);
    });

    it('should respect maxItems limit', async () => {
      const mockItems = Array(6).fill(null).map(() => ({
        $: jest.fn().mockResolvedValue({
          click: jest.fn(),
        }),
      } as unknown as ElementHandle<SVGElement | HTMLElement>));

      mockPage.$$.mockResolvedValue(mockItems);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(5); // Should only share maxItems (5)
    });

    it('should handle navigation failure to closet', async () => {
      mockPage.goto.mockRejectedValueOnce(new Error('Navigation failed'));

      await expect(shareAutomation.shareCloset()).rejects.toThrow(
        new AutomationError('Share automation failed', ErrorType.UNKNOWN)
      );
    });

    it('should handle failure to find closet items', async () => {
      mockPage.waitForSelector.mockRejectedValueOnce(new Error('Selector not found'));

      await expect(shareAutomation.shareCloset()).rejects.toThrow(
        new AutomationError('Share automation failed', ErrorType.UNKNOWN)
      );
    });

    it('should handle missing share button', async () => {
      const mockItems = [{
        $: jest.fn().mockResolvedValue(null),
      } as unknown as ElementHandle<SVGElement | HTMLElement>];

      mockPage.$$.mockResolvedValue(mockItems);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(0);
    });

    it('should handle not being logged in', async () => {
      // Force not logged in state
      await shareAutomation.cleanup();

      await expect(shareAutomation.shareCloset()).rejects.toThrow(
        new AutomationError('Not logged in', ErrorType.AUTH_FAILED)
      );
    });
  });

  describe('cleanup', () => {
    beforeEach(async () => {
      // Mock successful login
      mockPage.$.mockImplementation(async (selector: string) => {
        if (selector === '[data-testid="captcha"]') {
          return null;
        }
        if (selector === '[data-testid="user-profile"]') {
          return { isVisible: () => Promise.resolve(true) } as unknown as ElementHandle;
        }
        return null;
      });

      await shareAutomation.initialize();
    });

    it('should properly clean up resources', async () => {
      await shareAutomation.cleanup();

      expect(mockPage.close).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      mockPage.close.mockRejectedValue(new Error('Failed to close'));
      mockBrowser.close.mockRejectedValue(new Error('Failed to close'));

      await expect(shareAutomation.cleanup()).resolves.not.toThrow();
    });

    it('should handle cleanup when resources are already null', async () => {
      await shareAutomation.cleanup(); // First cleanup
      await shareAutomation.cleanup(); // Second cleanup should not throw

      expect(mockPage.close).toHaveBeenCalledTimes(1);
      expect(mockBrowser.close).toHaveBeenCalledTimes(1);
    });
  });
});
