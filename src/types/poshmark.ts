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

export interface PoshmarkLoginResult {
  success: boolean;
  error?: string;
  cookies?: PoshmarkCookie[];
}
