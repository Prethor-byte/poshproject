export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      poshmark_sessions: {
        Row: {
          id: string
          user_id: string
          username: string
          region: 'US' | 'CA'
          session_data: Json
          last_verified: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          region: 'US' | 'CA'
          session_data: Json
          last_verified?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          region?: 'US' | 'CA'
          session_data?: Json
          last_verified?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      proxy_configs: {
        Row: {
          id: string
          region: 'US' | 'CA'
          hostname: string
          port: number
          username: string | null
          password: string | null
          is_active: boolean
          last_used: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          region: 'US' | 'CA'
          hostname: string
          port: number
          username?: string | null
          password?: string | null
          is_active?: boolean
          last_used?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          region?: 'US' | 'CA'
          hostname?: string
          port?: number
          username?: string | null
          password?: string | null
          is_active?: boolean
          last_used?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proxy_stats: {
        Row: {
          id: string
          proxy_id: string
          region: 'US' | 'CA'
          success_count: number
          failure_count: number
          last_success: string | null
          last_failure: string | null
          average_response_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proxy_id: string
          region: 'US' | 'CA'
          success_count?: number
          failure_count?: number
          last_success?: string | null
          last_failure?: string | null
          average_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proxy_id?: string
          region?: 'US' | 'CA'
          success_count?: number
          failure_count?: number
          last_success?: string | null
          last_failure?: string | null
          average_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_proxy_stats: {
        Args: {
          p_proxy_id: string
          p_region: 'US' | 'CA'
          p_success: boolean
          p_response_time: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
