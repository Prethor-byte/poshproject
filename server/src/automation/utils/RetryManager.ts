import { logger } from './logger';
import { AutomationError, ErrorType } from './errors';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableErrors?: ErrorType[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryableErrors: [
    ErrorType.NETWORK,
    ErrorType.TIMEOUT,
    ErrorType.RATE_LIMIT,
    ErrorType.CAPTCHA
  ]
};

export class RetryManager {
  private readonly options: Required<RetryOptions>;

  constructor(options: RetryOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Executes an operation with exponential backoff retry strategy
   * @param operation Function to execute
   * @param context Additional context for logging
   */
  async executeWithBackoff<T>(
    operation: () => Promise<T>,
    context: Record<string, any> = {}
  ): Promise<T> {
    let lastError: Error | null = null;
    let attempt = 1;
    let delay = this.options.initialDelay;

    while (attempt <= this.options.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!this.isRetryableError(error)) {
          logger.error('Non-retryable error occurred', {
            error,
            attempt,
            ...context
          });
          throw error;
        }

        if (attempt === this.options.maxAttempts) {
          logger.error('Max retry attempts reached', {
            error,
            attempts: attempt,
            ...context
          });
          throw new AutomationError(
            `Operation failed after ${attempt} attempts`,
            error instanceof AutomationError ? error.type : ErrorType.UNKNOWN
          );
        }

        logger.warn('Operation failed, retrying', {
          error,
          attempt,
          nextDelay: delay,
          ...context
        });

        await this.sleep(delay);
        delay = Math.min(
          delay * this.options.backoffFactor,
          this.options.maxDelay
        );
        attempt++;
      }
    }

    // This should never happen due to the while loop condition
    throw lastError || new Error('Unexpected retry failure');
  }

  /**
   * Determines if an error is retryable based on configuration
   */
  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof AutomationError)) {
      return false;
    }

    return this.options.retryableErrors.includes(error.type);
  }

  /**
   * Introduces a delay in the execution
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
