"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetryManager_1 = require("../utils/RetryManager");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
jest.mock('../utils/logger', () => ({
    logger: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
    }
}));
describe('RetryManager', () => {
    let retryManager;
    beforeEach(() => {
        jest.clearAllMocks();
        retryManager = new RetryManager_1.RetryManager({
            maxAttempts: 3,
            initialDelay: 100,
            maxDelay: 1000,
            backoffFactor: 2
        });
    });
    it('should successfully execute an operation that succeeds', async () => {
        const operation = jest.fn().mockResolvedValue('success');
        const result = await retryManager.executeWithBackoff(operation);
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(1);
        expect(logger_1.logger.warn).not.toHaveBeenCalled();
        expect(logger_1.logger.error).not.toHaveBeenCalled();
    });
    it('should retry on retryable errors and eventually succeed', async () => {
        const operation = jest.fn()
            .mockRejectedValueOnce(new errors_1.AutomationError('Network error', errors_1.ErrorType.NETWORK))
            .mockResolvedValueOnce('success');
        const result = await retryManager.executeWithBackoff(operation);
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(2);
        expect(logger_1.logger.warn).toHaveBeenCalledTimes(1);
        expect(logger_1.logger.error).not.toHaveBeenCalled();
    });
    it('should throw immediately on non-retryable errors', async () => {
        const error = new errors_1.AutomationError('Auth failed', errors_1.ErrorType.AUTH_FAILED);
        const operation = jest.fn().mockRejectedValue(error);
        await expect(retryManager.executeWithBackoff(operation))
            .rejects
            .toThrow(error);
        expect(operation).toHaveBeenCalledTimes(1);
        expect(logger_1.logger.error).toHaveBeenCalledTimes(1);
        expect(logger_1.logger.warn).not.toHaveBeenCalled();
    });
    it('should respect max attempts and throw after all retries fail', async () => {
        const error = new errors_1.AutomationError('Network error', errors_1.ErrorType.NETWORK);
        const operation = jest.fn().mockRejectedValue(error);
        await expect(retryManager.executeWithBackoff(operation))
            .rejects
            .toThrow('Operation failed after 3 attempts');
        expect(operation).toHaveBeenCalledTimes(3);
        expect(logger_1.logger.warn).toHaveBeenCalledTimes(2);
        expect(logger_1.logger.error).toHaveBeenCalledTimes(1);
    });
    it('should use exponential backoff for delays', async () => {
        jest.useFakeTimers();
        const error = new errors_1.AutomationError('Network error', errors_1.ErrorType.NETWORK);
        const operation = jest.fn().mockRejectedValue(error);
        const promise = retryManager.executeWithBackoff(operation);
        // First attempt fails immediately
        await jest.advanceTimersByTimeAsync(0);
        expect(operation).toHaveBeenCalledTimes(1);
        // Second attempt after initial delay (100ms)
        await jest.advanceTimersByTimeAsync(100);
        expect(operation).toHaveBeenCalledTimes(2);
        // Third attempt after doubled delay (200ms)
        await jest.advanceTimersByTimeAsync(200);
        expect(operation).toHaveBeenCalledTimes(3);
        await expect(promise).rejects.toThrow();
        jest.useRealTimers();
    });
    it('should respect maxDelay limit', async () => {
        const retryManager = new RetryManager_1.RetryManager({
            maxAttempts: 4,
            initialDelay: 500,
            maxDelay: 1000,
            backoffFactor: 3
        });
        const error = new errors_1.AutomationError('Network error', errors_1.ErrorType.NETWORK);
        const operation = jest.fn().mockRejectedValue(error);
        jest.useFakeTimers();
        const promise = retryManager.executeWithBackoff(operation);
        // First attempt fails immediately
        await jest.advanceTimersByTimeAsync(0);
        expect(operation).toHaveBeenCalledTimes(1);
        // Second attempt after 500ms
        await jest.advanceTimersByTimeAsync(500);
        expect(operation).toHaveBeenCalledTimes(2);
        // Third attempt after 1000ms (limited by maxDelay)
        await jest.advanceTimersByTimeAsync(1000);
        expect(operation).toHaveBeenCalledTimes(3);
        // Fourth attempt after 1000ms (limited by maxDelay)
        await jest.advanceTimersByTimeAsync(1000);
        expect(operation).toHaveBeenCalledTimes(4);
        await expect(promise).rejects.toThrow();
        jest.useRealTimers();
    });
});
