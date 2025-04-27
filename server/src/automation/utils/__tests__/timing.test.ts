import { delay, randomDelay } from '../timing';

beforeEach(() => {
  const { RateLimiter } = require('../RateLimiter');
  RateLimiter._resetInstanceForTests?.();
  RateLimiter.getInstance({
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 300,
    maxConcurrentRequests: 5,
    cooldownPeriod: 2000
  })._reset();
  jest.clearAllMocks();
});

describe('Timing Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('delay', () => {
    it('should delay for the specified time', async () => {
      const delayPromise = delay(1000);
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      jest.runAllTimers();
      await expect(delayPromise).resolves.toBeUndefined();
    });

    it('should handle zero delay', async () => {
      const delayPromise = delay(0);
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
      jest.runAllTimers();
      await expect(delayPromise).resolves.toBeUndefined();
    });
  });

  describe('randomDelay', () => {
    it('should delay between min and max time', async () => {
      const min = 1000;
      const max = 2000;
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

      const delayPromise = randomDelay(min, max);
      
      // With Math.random() = 0.5, delay should be 1500
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1500);
      jest.runAllTimers();
      await expect(delayPromise).resolves.toBeUndefined();

      mockRandom.mockRestore();
    });

    it('should handle min equal to max', async () => {
      const time = 1000;
      const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);

      const delayPromise = randomDelay(time, time);
      
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), time);
      jest.runAllTimers();
      await expect(delayPromise).resolves.toBeUndefined();

      mockRandom.mockRestore();
    });

    it('should handle edge cases of Math.random', async () => {
      const min = 1000;
      const max = 2000;
      
      // Test with Math.random() = 0
      const mockRandomMin = jest.spyOn(Math, 'random').mockReturnValue(0);
      const minDelayPromise = randomDelay(min, max);
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), min);
      jest.runAllTimers();
      await expect(minDelayPromise).resolves.toBeUndefined();
      mockRandomMin.mockRestore();

      // Test with Math.random() = 0.99999...
      const mockRandomMax = jest.spyOn(Math, 'random').mockReturnValue(0.999999999);
      const maxDelayPromise = randomDelay(min, max);
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), max);
      jest.runAllTimers();
      await expect(maxDelayPromise).resolves.toBeUndefined();
      mockRandomMax.mockRestore();
    });
  });
});
