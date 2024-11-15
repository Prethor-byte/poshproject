import { useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  error: AuthError | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState((prev) => ({ 
        ...prev, 
        session, 
        user: session?.user ?? null,
        error,
        loading: false 
      }));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ 
        ...prev, 
        session,
        user: session?.user ?? null,
        loading: false
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setState(prev => ({ 
        ...prev, 
        session: data.session,
        user: data.session?.user ?? null,
        error: null,
      }));
      return { data, error: null };
    } catch (err) {
      const error = err as AuthError;
      setState(prev => ({ ...prev, error }));
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setState(prev => ({ 
        ...prev, 
        session: data.session,
        user: data.session?.user ?? null,
        error: null,
      }));
      return { data, error: null };
    } catch (err) {
      const error = err as AuthError;
      setState(prev => ({ ...prev, error }));
      return { data: null, error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ session: null, user: null, error: null, loading: false });
    } catch (err) {
      const error = err as AuthError;
      setState(prev => ({ ...prev, error, loading: false }));
    }
  };

  return {
    session: state.session,
    user: state.user,
    error: state.error,
    loading: state.loading,
    signIn,
    signUp,
    signOut,
  };
}
