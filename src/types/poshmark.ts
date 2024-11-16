export interface PoshmarkAccount {
  id: string;
  email: string;
  username: string | null;
  last_login: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoshmarkCookie {
  name: string;
  value: string;
  domain: string;
}

export type PoshmarkRegion = 'US' | 'CA';

export interface PoshmarkSession {
  username: string;
  cookies: Record<string, string>;
  region: PoshmarkRegion;
}

export interface PoshmarkSessionRecord {
  id: string;
  user_id: string;
  username: string;
  region: PoshmarkRegion;
  session_data: PoshmarkSession;
  is_active: boolean;
  last_verified: string;
  created_at: string;
  updated_at: string;
}

export interface ImportSessionRequest {
  region: PoshmarkRegion;
  useProxy?: boolean;
}

export interface ImportSessionResult {
  success: boolean;
  session?: PoshmarkSession;
  error?: string;
}

export interface VerifySessionRequest {
  session: PoshmarkSession;
  region: PoshmarkRegion;
  useProxy?: boolean;
}

export interface VerifySessionResult {
  success: boolean;
  is_active: boolean;
  error?: string;
}

export interface PoshmarkLoginResult {
  success: boolean;
  session?: PoshmarkSession;
  error?: string;
  username?: string;
}
