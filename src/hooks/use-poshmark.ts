import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import type { PoshmarkSessionRecord, ImportSessionResult, VerifySessionResult, PoshmarkRegion } from '@/types/poshmark';
import { isFeatureEnabled } from '@/config/features';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const POSHMARK_URLS = {
  US: 'https://poshmark.com',
  CA: 'https://poshmark.ca'
};

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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

  const importSession = useCallback(async (region: PoshmarkRegion) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Check if server is running
      const healthCheck = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        credentials: 'include',
      }).catch(() => null);

      if (!healthCheck?.ok) {
        throw new Error('Server is not running. Please start the server first.');
      }

      // Import session with region
      const response = await fetch(`${API_URL}/api/poshmark/import-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          region,
          useProxy: isFeatureEnabled('ENABLE_PROXY')
        })
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
          region: result.session.region,
          session_data: result.session,
          last_verified: new Date().toISOString(),
          is_active: true
        });

      if (insertError) throw insertError;

      await fetchSessions();
      return result.session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import session';
      setError({
        message: 'Failed to connect Poshmark account',
        details: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchSessions]);

  const verifySession = useCallback(async (sessionId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Get session from database
      const { data: sessionData, error: fetchError } = await supabase
        .from('poshmark_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError || !sessionData) {
        throw new Error('Session not found');
      }

      // Verify session with backend
      const response = await fetch(`${API_URL}/api/poshmark/verify-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: sessionData.session_data,
          region: sessionData.region,
          useProxy: isFeatureEnabled('ENABLE_PROXY')
        })
      });

      const result: VerifySessionResult = await response.json();

      // Update session status
      const { error: updateError } = await supabase
        .from('poshmark_sessions')
        .update({
          is_active: result.is_active,
          last_verified: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      await fetchSessions();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify session';
      setError({
        message: 'Failed to verify Poshmark session',
        details: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchSessions]);

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

      await fetchSessions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove session';
      setError({
        message: 'Failed to remove Poshmark account',
        details: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchSessions]);

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
