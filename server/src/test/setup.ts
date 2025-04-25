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

  // Ensure RateLimiter singleton is initialized for all tests
  const { RateLimiter } = require('../automation/utils/RateLimiter');
  RateLimiter.getInstance({
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 5,
    cooldownPeriod: 2000
  })._reset();
});

afterAll(async () => {
  // Clean up any remaining browser sessions
  const { BrowserManager } = require('../automation/utils/BrowserManager');
  const manager = BrowserManager.getInstance();
  if (manager && typeof manager.closeAllSessions === 'function') {
    await manager.closeAllSessions();
  }
});
