import { Browser, Page } from 'playwright';
import { ShareAutomation } from '../sharing/ShareAutomation';
import { BrowserManager } from '../utils/BrowserManager';
import { AutomationError, ErrorType } from '../utils/errors';

// Mock the browser manager and its dependencies
jest.mock('../utils/BrowserManager');
jest.mock('../utils/logger');

describe('ShareAutomation', () => {
  let shareAutomation: ShareAutomation;
  let mockBrowser: jest.Mocked<Browser>;
  let mockPage: jest.Mocked<Page>;

  beforeEach(() => {
    // Reset mocks
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

    // Mock BrowserManager implementation
    (BrowserManager as jest.Mock).mockImplementation(() => ({
      createSession: jest.fn().mockResolvedValue({ browser: mockBrowser, page: mockPage }),
    }));

    // Create ShareAutomation instance
    shareAutomation = new ShareAutomation({
      username: 'testuser',
      maxItems: 5,
      delayBetweenShares: [1000, 2000],
    });
  });

  describe('initialize', () => {
    it('should successfully initialize and login', async () => {
      // Mock successful login
      mockPage.$.mockResolvedValue({ isVisible: () => Promise.resolve(true) });

      await shareAutomation.initialize();
      
      expect(mockPage.goto).toHaveBeenCalledWith('https://poshmark.com/login');
      expect(mockPage.fill).toHaveBeenCalledTimes(2); // username and password
      expect(mockPage.click).toHaveBeenCalledWith('button[type="submit"]');
    });

    it('should handle CAPTCHA detection', async () => {
      // Mock CAPTCHA presence
      mockPage.$.mockImplementation((selector) => {
        if (selector === '[data-testid="captcha"]') {
          return Promise.resolve({ isVisible: () => Promise.resolve(true) });
        }
        return Promise.resolve(null);
      });

      await expect(shareAutomation.initialize()).rejects.toThrow(
        new AutomationError('CAPTCHA detected', ErrorType.CAPTCHA)
      );
    });

    it('should handle login failure', async () => {
      // Mock failed login
      mockPage.$.mockResolvedValue(null);

      await expect(shareAutomation.initialize()).rejects.toThrow(
        new AutomationError('Login failed', ErrorType.AUTH_FAILED)
      );
    });
  });

  describe('shareCloset', () => {
    beforeEach(async () => {
      // Mock successful login
      mockPage.$.mockResolvedValue({ isVisible: () => Promise.resolve(true) });
      await shareAutomation.initialize();
    });

    it('should successfully share items', async () => {
      // Mock closet items
      mockPage.$$.mockResolvedValue([
        { click: jest.fn() },
        { click: jest.fn() },
        { click: jest.fn() },
      ]);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(3);
      expect(mockPage.goto).toHaveBeenCalledWith(
        'https://poshmark.com/closet/testuser'
      );
      expect(mockPage.waitForSelector).toHaveBeenCalledWith(
        '[data-testid="closet-items"]'
      );
    });

    it('should handle empty closet', async () => {
      // Mock empty closet
      mockPage.$$.mockResolvedValue([]);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(0);
    });

    it('should handle sharing errors', async () => {
      // Mock sharing error
      mockPage.$$.mockResolvedValue([
        { 
          click: jest.fn().mockRejectedValue(
            new Error('Failed to share item')
          )
        },
      ]);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(0);
    });

    it('should respect maxItems limit', async () => {
      // Mock more items than maxItems
      mockPage.$$.mockResolvedValue([
        { click: jest.fn() },
        { click: jest.fn() },
        { click: jest.fn() },
        { click: jest.fn() },
        { click: jest.fn() },
        { click: jest.fn() }, // Extra item
      ]);

      const result = await shareAutomation.shareCloset();

      expect(result).toBe(5); // Should only share maxItems (5)
    });
  });

  describe('cleanup', () => {
    it('should properly clean up resources', async () => {
      await shareAutomation.cleanup();

      expect(mockPage.close).toHaveBeenCalled();
      expect(mockBrowser.close).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      // Mock cleanup error
      mockPage.close.mockRejectedValue(new Error('Failed to close'));
      mockBrowser.close.mockRejectedValue(new Error('Failed to close'));

      await expect(shareAutomation.cleanup()).resolves.not.toThrow();
    });
  });
});
