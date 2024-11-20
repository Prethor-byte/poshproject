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

// Extend Jest timeout for Playwright operations
jest.setTimeout(30000);

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

// Global teardown
afterAll(async () => {
  // Clean up any remaining browser sessions
  const BrowserManager = require('../automation/utils/BrowserManager').BrowserManager;
  await BrowserManager.getInstance().closeAllSessions();
});
