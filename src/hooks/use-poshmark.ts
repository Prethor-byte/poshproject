import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { PoshmarkSessionRecord, ImportSessionResult, VerifySessionResult } from '@/types/poshmark';

const API_URL = 'http://localhost:3001';

export function usePoshmark() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<PoshmarkSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('poshmark_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Import a new session
  const importSession = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      const response = await fetch(`${API_URL}/api/poshmark/import-session`, {
        method: 'POST',
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
      throw err instanceof Error ? err : new Error('Failed to import session');
    }
  }, [user, fetchSessions]);

  // Verify a session
  const verifySession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Get session from local state
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const response = await fetch(`${API_URL}/api/poshmark/verify-session`, {
        method: 'POST',
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
      throw err instanceof Error ? err : new Error('Failed to verify session');
    }
  }, [user, sessions, fetchSessions]);

  // Remove a session
  const removeSession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('poshmark_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to remove session');
    }
  }, [user, fetchSessions]);

  // Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    importSession,
    verifySession,
    removeSession,
  };
}
