import { AutomationError, ErrorType } from '../errors';

describe('AutomationError', () => {
  it('should create an error with default recoverable value', () => {
    const error = new AutomationError('Test error', ErrorType.UNKNOWN);
    expect(error.message).toBe('Test error');
    expect(error.type).toBe(ErrorType.UNKNOWN);
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('AutomationError');
  });

  it('should create an error with custom recoverable value', () => {
    const error = new AutomationError('Test error', ErrorType.UNKNOWN, false);
    expect(error.recoverable).toBe(false);
  });

  describe('isRecoverable', () => {
    it('should return true for recoverable errors', () => {
      const error = new AutomationError('Test error', ErrorType.NETWORK);
      expect(AutomationError.isRecoverable(error)).toBe(true);
    });

    it('should return false for non-recoverable errors', () => {
      const error = new AutomationError('Test error', ErrorType.AUTH_FAILED);
      expect(AutomationError.isRecoverable(error)).toBe(false);
    });

    it('should return false when recoverable is false regardless of type', () => {
      const error = new AutomationError('Test error', ErrorType.NETWORK, false);
      expect(AutomationError.isRecoverable(error)).toBe(false);
    });

    it('should return false for setup failures', () => {
      const error = new AutomationError('Test error', ErrorType.SETUP_FAILED);
      expect(AutomationError.isRecoverable(error)).toBe(false);
    });

    it('should return true for other error types', () => {
      const otherErrors = [
        ErrorType.CAPTCHA,
        ErrorType.RATE_LIMIT,
        ErrorType.NETWORK,
        ErrorType.TIMEOUT,
        ErrorType.UNKNOWN
      ];

      otherErrors.forEach(errorType => {
        const error = new AutomationError('Test error', errorType);
        expect(AutomationError.isRecoverable(error)).toBe(true);
      });
    });
  });
});
