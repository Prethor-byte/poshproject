import type { PoshmarkLoginResult } from '@/types/poshmark';

const API_URL = 'http://localhost:3001';

export async function playwrightLogin(email: string, password: string): Promise<PoshmarkLoginResult> {
  try {
    const response = await fetch(`${API_URL}/api/poshmark/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to automation server',
    };
  }
}
