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

export interface PoshmarkSession {
  cookies: PoshmarkCookie[];
  username?: string;
}

export interface PoshmarkSessionRecord {
  id: string;
  user_id: string;
  username?: string;
  session_data: PoshmarkSession;
  last_verified: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportSessionResult {
  success: boolean;
  session?: PoshmarkSession;
  error?: string;
}

export interface VerifySessionResult {
  success: boolean;
  isValid: boolean;
  error?: string;
}

export interface PoshmarkLoginResult {
  success: boolean;
  error?: string;
  cookies?: PoshmarkCookie[];
}
