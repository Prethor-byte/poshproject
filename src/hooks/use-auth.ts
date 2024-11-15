import { useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState((prev) => ({ ...prev, session, error }));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, session }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setState((prev) => ({ ...prev, error }));
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setState((prev) => ({ ...prev, error }));
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setState((prev) => ({ ...prev, error }));
    return { error };
  };

  return {
    session: state.session,
    user: state.session?.user ?? null,
    error: state.error,
    signIn,
    signUp,
    signOut,
  };
}
