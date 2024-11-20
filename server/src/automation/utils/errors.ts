export enum ErrorType {
  AUTH_FAILED = 'AUTH_FAILED',
  SETUP_FAILED = 'SETUP_FAILED',
  CAPTCHA = 'CAPTCHA',
  RATE_LIMIT = 'RATE_LIMIT',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

export class AutomationError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public readonly recoverable: boolean = true
  ) {
    super(message);
    this.name = 'AutomationError';
  }

  static isRecoverable(error: AutomationError): boolean {
    return error.recoverable && ![
      ErrorType.AUTH_FAILED,
      ErrorType.SETUP_FAILED
    ].includes(error.type);
  }
}
