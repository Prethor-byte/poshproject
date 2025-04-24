"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RetryManager_1 = require("../RetryManager");
const errors_1 = require("../errors");
describe('RetryManager', () => {
    it('retries on retryable error and succeeds', async () => {
        let attempts = 0;
        const manager = new RetryManager_1.RetryManager({
            maxAttempts: 3,
            initialDelay: 1,
            maxDelay: 10,
            backoffFactor: 2,
            retryableErrors: [errors_1.ErrorType.NETWORK]
        });
        const result = await manager.executeWithBackoff(async () => {
            attempts++;
            if (attempts < 2)
                throw new errors_1.AutomationError('fail', errors_1.ErrorType.NETWORK);
            return 'success';
        });
        expect(result).toBe('success');
        expect(attempts).toBe(2);
    });
    it('throws after max attempts on retryable error', async () => {
        const manager = new RetryManager_1.RetryManager({
            maxAttempts: 2,
            initialDelay: 1,
            maxDelay: 10,
            backoffFactor: 2,
            retryableErrors: [errors_1.ErrorType.NETWORK]
        });
        let attempts = 0;
        try {
            await manager.executeWithBackoff(async () => {
                attempts++;
                throw new errors_1.AutomationError('fail', errors_1.ErrorType.NETWORK);
            });
        }
        catch (err) {
            expect(err.message).toContain('Operation failed after 2 attempts');
            expect(attempts).toBe(2);
        }
    });
    it('throws immediately on non-retryable error', async () => {
        const manager = new RetryManager_1.RetryManager({ retryableErrors: [errors_1.ErrorType.NETWORK] });
        await expect(manager.executeWithBackoff(async () => {
            throw new errors_1.AutomationError('fail', errors_1.ErrorType.AUTH_FAILED);
        })).rejects.toThrow('fail');
    });
    it('returns result on first try if no error', async () => {
        const manager = new RetryManager_1.RetryManager();
        const result = await manager.executeWithBackoff(async () => 'ok');
        expect(result).toBe('ok');
    });
    it('throws last error if all attempts exhausted (coverage for fallback throw)', async () => {
        const manager = new RetryManager_1.RetryManager({ maxAttempts: 1, retryableErrors: [errors_1.ErrorType.NETWORK] });
        await expect(manager.executeWithBackoff(async () => {
            throw new Error('unexpected');
        })).rejects.toThrow('unexpected');
    });
    it('isRetryableError returns false for non-AutomationError', () => {
        const manager = new RetryManager_1.RetryManager();
        // @ts-ignore
        expect(manager["isRetryableError"](new Error('nope'))).toBe(false);
    });
    it('isRetryableError returns true for AutomationError with retryable type', () => {
        const manager = new RetryManager_1.RetryManager({ retryableErrors: [errors_1.ErrorType.NETWORK] });
        // @ts-ignore
        expect(manager["isRetryableError"](new errors_1.AutomationError('fail', errors_1.ErrorType.NETWORK))).toBe(true);
    });
    it('isRetryableError returns false for AutomationError with non-retryable type', () => {
        const manager = new RetryManager_1.RetryManager({ retryableErrors: [errors_1.ErrorType.NETWORK] });
        // @ts-ignore
        expect(manager["isRetryableError"](new errors_1.AutomationError('fail', errors_1.ErrorType.AUTH_FAILED))).toBe(false);
    });
});
