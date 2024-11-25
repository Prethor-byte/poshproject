"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
describe('AutomationError', () => {
    it('should create an error with default recoverable value', () => {
        const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.UNKNOWN);
        expect(error.message).toBe('Test error');
        expect(error.type).toBe(errors_1.ErrorType.UNKNOWN);
        expect(error.recoverable).toBe(true);
        expect(error.name).toBe('AutomationError');
    });
    it('should create an error with custom recoverable value', () => {
        const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.UNKNOWN, false);
        expect(error.recoverable).toBe(false);
    });
    describe('isRecoverable', () => {
        it('should return true for recoverable errors', () => {
            const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.NETWORK);
            expect(errors_1.AutomationError.isRecoverable(error)).toBe(true);
        });
        it('should return false for non-recoverable errors', () => {
            const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.AUTH_FAILED);
            expect(errors_1.AutomationError.isRecoverable(error)).toBe(false);
        });
        it('should return false when recoverable is false regardless of type', () => {
            const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.NETWORK, false);
            expect(errors_1.AutomationError.isRecoverable(error)).toBe(false);
        });
        it('should return false for setup failures', () => {
            const error = new errors_1.AutomationError('Test error', errors_1.ErrorType.SETUP_FAILED);
            expect(errors_1.AutomationError.isRecoverable(error)).toBe(false);
        });
        it('should return true for other error types', () => {
            const otherErrors = [
                errors_1.ErrorType.CAPTCHA,
                errors_1.ErrorType.RATE_LIMIT,
                errors_1.ErrorType.NETWORK,
                errors_1.ErrorType.TIMEOUT,
                errors_1.ErrorType.UNKNOWN
            ];
            otherErrors.forEach(errorType => {
                const error = new errors_1.AutomationError('Test error', errorType);
                expect(errors_1.AutomationError.isRecoverable(error)).toBe(true);
            });
        });
    });
});
