"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["AUTH_FAILED"] = "AUTH_FAILED";
    ErrorType["SETUP_FAILED"] = "SETUP_FAILED";
    ErrorType["CAPTCHA"] = "CAPTCHA";
    ErrorType["RATE_LIMIT"] = "RATE_LIMIT";
    ErrorType["NETWORK"] = "NETWORK";
    ErrorType["TIMEOUT"] = "TIMEOUT";
    ErrorType["UNKNOWN"] = "UNKNOWN";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class AutomationError extends Error {
    constructor(message, type, recoverable = true) {
        super(message);
        this.type = type;
        this.recoverable = recoverable;
        this.name = 'AutomationError';
    }
    static isRecoverable(error) {
        return error.recoverable && ![
            ErrorType.AUTH_FAILED,
            ErrorType.SETUP_FAILED
        ].includes(error.type);
    }
}
exports.AutomationError = AutomationError;
