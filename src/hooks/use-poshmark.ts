import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import { playwrightLogin } from '@/lib/playwrightLogin';
import type { PoshmarkAccount, PoshmarkLoginResult } from '@/types/poshmark';
import CryptoJS from 'crypto-js';

// Use environment variable for encryption key
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-key';

export function usePoshmark() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<PoshmarkAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Encrypt sensitive data
  const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  };

  // Load accounts
  useEffect(() => {
    if (!user) return;

    async function loadAccounts() {
      try {
        const { data, error } = await supabase
          .from('poshmark_accounts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAccounts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    }

    loadAccounts();
  }, [user]);

  // Add a new Poshmark account
  const addAccount = async (email: string, password: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);

      // Try logging in to Poshmark first
      const loginResult = await playwrightLogin(email, password);
      if (!loginResult.success || !loginResult.cookies) {
        throw new Error(loginResult.error || 'Failed to login to Poshmark');
      }

      // Store account in database
      const { data, error } = await supabase
        .from('poshmark_accounts')
        .insert({
          user_id: user.id,
          email,
          encrypted_password: encrypt(password),
          cookies: loginResult.cookies,
          last_login: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setAccounts((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add account';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remove a Poshmark account
  const removeAccount = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('poshmark_accounts')
        .delete()
        .match({ id });

      if (error) throw error;
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove account');
    }
  };

  // Verify account login status
  const verifyAccount = async (id: string): Promise<PoshmarkLoginResult> => {
    try {
      setError(null);
      const { data: account, error } = await supabase
        .from('poshmark_accounts')
        .select('*')
        .match({ id })
        .single();

      if (error) throw error;

      // Try logging in with stored credentials
      const loginResult = await playwrightLogin(account.email, account.encrypted_password);
      
      // Update last login and cookies if successful
      if (loginResult.success && loginResult.cookies) {
        await supabase
          .from('poshmark_accounts')
          .update({
            last_login: new Date().toISOString(),
            cookies: loginResult.cookies,
          })
          .match({ id });

        // Update local state
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === id
              ? { ...acc, last_login: new Date().toISOString() }
              : acc
          )
        );
      }

      return loginResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify account';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    removeAccount,
    verifyAccount,
  };
}
