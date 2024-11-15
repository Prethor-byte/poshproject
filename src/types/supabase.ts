export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TaskType = 'share' | 'follow' | 'relist';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type SubscriptionStatus = 'free' | 'basic' | 'pro';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          last_login: string | null
          subscription_status: SubscriptionStatus
          subscription_expires_at: string | null
          poshmark_username: string | null
          poshmark_password: string | null
          settings: Json
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          last_login?: string | null
          subscription_status?: SubscriptionStatus
          subscription_expires_at?: string | null
          poshmark_username?: string | null
          poshmark_password?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          last_login?: string | null
          subscription_status?: SubscriptionStatus
          subscription_expires_at?: string | null
          poshmark_username?: string | null
          poshmark_password?: string | null
          settings?: Json
        }
      }
      automation_tasks: {
        Row: {
          id: string
          user_id: string
          task_type: TaskType
          status: TaskStatus
          created_at: string
          scheduled_for: string | null
          completed_at: string | null
          settings: Json
          priority: number
        }
        Insert: {
          id?: string
          user_id: string
          task_type: TaskType
          status?: TaskStatus
          created_at?: string
          scheduled_for?: string | null
          completed_at?: string | null
          settings?: Json
          priority?: number
        }
        Update: {
          id?: string
          user_id?: string
          task_type?: TaskType
          status?: TaskStatus
          created_at?: string
          scheduled_for?: string | null
          completed_at?: string | null
          settings?: Json
          priority?: number
        }
      }
      task_results: {
        Row: {
          id: string
          task_id: string
          status: string
          error_message: string | null
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          task_id: string
          status: string
          error_message?: string | null
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          task_id?: string
          status?: string
          error_message?: string | null
          created_at?: string
          metadata?: Json
        }
      }
      browser_profiles: {
        Row: {
          id: string
          user_id: string | null
          user_agent: string
          viewport: Json
          timezone: string
          last_used: string | null
          success_rate: number | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          user_agent: string
          viewport: Json
          timezone: string
          last_used?: string | null
          success_rate?: number | null
        }
        Update: {
          id?: string
          user_id?: string | null
          user_agent?: string
          viewport?: Json
          timezone?: string
          last_used?: string | null
          success_rate?: number | null
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          poshmark_session_id: string | null
          cookies: Json | null
          created_at: string
          expires_at: string | null
          last_used: string | null
          is_valid: boolean
        }
        Insert: {
          id?: string
          user_id: string
          poshmark_session_id?: string | null
          cookies?: Json | null
          created_at?: string
          expires_at?: string | null
          last_used?: string | null
          is_valid?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          poshmark_session_id?: string | null
          cookies?: Json | null
          created_at?: string
          expires_at?: string | null
          last_used?: string | null
          is_valid?: boolean
        }
      }
      rate_limits: {
        Row: {
          id: string
          user_id: string
          action_type: string
          last_action: string
          count: number
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          last_action?: string
          count?: number
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          last_action?: string
          count?: number
        }
      }
    }
    Functions: {
      get_next_browser_profile: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
    }
  }
}