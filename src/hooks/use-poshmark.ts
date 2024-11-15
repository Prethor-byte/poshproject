import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { PoshmarkSessionRecord, ImportSessionResult, VerifySessionResult } from '@/types/poshmark';

const API_URL = 'http://localhost:3001';

export interface PoshmarkError {
  message: string;
  code?: string;
  details?: string;
}

export function usePoshmark() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<PoshmarkSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PoshmarkError | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('poshmark_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError({
        message: 'Failed to fetch sessions',
        details: err instanceof Error ? err.message : undefined
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Import a new session
  const importSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // First check if server is running
      const healthCheck = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        credentials: 'include',
      }).catch(() => null);

      if (!healthCheck?.ok) {
        throw new Error('Server is not running. Please start the server first.');
      }

      const response = await fetch(`${API_URL}/api/poshmark/import-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: ImportSessionResult = await response.json();
      
      if (!result.success || !result.session) {
        throw new Error(result.error || 'Failed to import session');
      }

      // Save session to Supabase
      const { error: insertError } = await supabase
        .from('poshmark_sessions')
        .insert({
          user_id: user.id,
          username: result.session.username,
          session_data: result.session,
          last_verified: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // Refresh sessions list
      await fetchSessions();

      return result.session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import session';
      setError({
        message: 'Failed to connect Poshmark account',
        details: errorMessage,
        code: err instanceof Error && 'errorCode' in err ? (err as any).errorCode : undefined
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, fetchSessions]);

  // Verify a session
  const verifySession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Get session from local state
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const response = await fetch(`${API_URL}/api/poshmark/verify-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: session.session_data,
        }),
      });

      const result: VerifySessionResult = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to verify session');
      }

      // Update session verification timestamp and status
      const { error: updateError } = await supabase
        .from('poshmark_sessions')
        .update({
          last_verified: new Date().toISOString(),
          is_active: result.isValid,
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      // Refresh sessions list
      await fetchSessions();

      return result.isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify session';
      setError({
        message: 'Failed to verify Poshmark session',
        details: errorMessage
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, sessions, fetchSessions]);

  // Remove a session
  const removeSession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('poshmark_sessions')
        .delete()
        .eq('id', sessionId);

      if (deleteError) throw deleteError;

      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove session';
      setError({
        message: 'Failed to remove Poshmark account',
        details: errorMessage
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, fetchSessions]);

  // Load sessions on mount and when user changes
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    clearError,
    importSession,
    verifySession,
    removeSession,
  };
}
