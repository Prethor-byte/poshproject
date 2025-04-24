"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryManager = void 0;
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const DEFAULT_OPTIONS = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
    retryableErrors: [
        errors_1.ErrorType.NETWORK,
        errors_1.ErrorType.TIMEOUT,
        errors_1.ErrorType.RATE_LIMIT,
        errors_1.ErrorType.CAPTCHA
    ]
};
class RetryManager {
    constructor(options = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }
    /**
     * Executes an operation with exponential backoff retry strategy
     * @param operation Function to execute
     * @param context Additional context for logging
     */
    async executeWithBackoff(operation, context = {}) {
        let lastError = null;
        let attempt = 1;
        let delay = this.options.initialDelay;
        while (attempt <= this.options.maxAttempts) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (!this.isRetryableError(error)) {
                    logger_1.logger.error('Non-retryable error occurred', {
                        error,
                        attempt,
                        ...context
                    });
                    throw error;
                }
                if (attempt === this.options.maxAttempts) {
                    logger_1.logger.error('Max retry attempts reached', {
                        error,
                        attempts: attempt,
                        ...context
                    });
                    throw new errors_1.AutomationError(`Operation failed after ${attempt} attempts`, error instanceof errors_1.AutomationError ? error.type : errors_1.ErrorType.UNKNOWN);
                }
                logger_1.logger.warn('Operation failed, retrying', {
                    error,
                    attempt,
                    nextDelay: delay,
                    ...context
                });
                await this.sleep(delay);
                delay = Math.min(delay * this.options.backoffFactor, this.options.maxDelay);
                attempt++;
            }
        }
        // This should never happen due to the while loop condition
        throw lastError || new Error('Unexpected retry failure');
    }
    /**
     * Determines if an error is retryable based on configuration
     */
    isRetryableError(error) {
        if (!(error instanceof errors_1.AutomationError)) {
            return false;
        }
        return this.options.retryableErrors.includes(error.type);
    }
    /**
     * Introduces a delay in the execution
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.RetryManager = RetryManager;
