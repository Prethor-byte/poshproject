import { chromium } from 'playwright';
import { BrowserManager } from '../utils/BrowserManager';

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('BrowserManager', () => {
  let browserManager: BrowserManager;

  beforeEach(() => {
    jest.clearAllMocks();
    browserManager = BrowserManager.getInstance();
  });

  it('should be a singleton', () => {
    const instance1 = BrowserManager.getInstance();
    const instance2 = BrowserManager.getInstance();
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

    (chromium.launch as jest.Mock).mockResolvedValue(mockBrowser);

    const profile = {
      id: 'test-profile',
      userAgent: 'test-agent',
      viewport: { width: 1920, height: 1080 },
      timezone: 'America/New_York',
      geolocation: { latitude: 40.7128, longitude: -74.0060 },
    };

    await browserManager.createSession(profile);

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
  });
});
