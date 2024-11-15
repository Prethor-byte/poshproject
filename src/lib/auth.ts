import { supabase } from './supabase';
import { toast } from 'sonner';

export type AuthProvider = 'google' | 'facebook';

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    toast.error('Failed to sign in. Please try again.');
    return { data: null, error };
  }
}

export async function signInWithProvider(provider: AuthProvider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in with provider:', error);
    toast.error('Failed to sign in. Please try again.');
    return { data: null, error };
  }
}

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    toast.success('Check your email to confirm your account');
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    toast.error('Failed to create account. Please try again.');
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast.success('Signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out. Please try again.');
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    toast.success('Check your email for the password reset link');
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    toast.error('Failed to send reset email. Please try again.');
    return { error };
  }
}