import { Browser, BrowserContext } from 'playwright';
import { BrowserProfile } from './browserProfile';
import { ErrorType } from './errors';

export type SessionStatus = 'healthy' | 'degraded' | 'failed';

export interface ErrorRecord {
  type: ErrorType;
  message: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface SessionMetrics {
  totalOperations: number;
  failedOperations: number;
  averageResponseTime: number;
  lastResponseTime: number;
}

export interface OperationMetrics {
  operationDuration: number;
  success: boolean;
  errorType?: ErrorType;
}

export interface SessionHealth {
  status: SessionStatus;
  lastCheck: Date;
  lastUsed: Date;
  errors: ErrorRecord[];
  recoveryAttempts: number;
  metrics: SessionMetrics;
}

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  profile: BrowserProfile;
  userId: string;
  health: SessionHealth;
  createdAt: Date;
}
