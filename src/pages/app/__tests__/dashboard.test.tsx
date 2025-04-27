jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));
jest.mock('@supabase/supabase-js', () => ({ AuthError: class {}, Session: class {}, User: class {} }));
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import * as useAuthModule from '@/hooks/use-auth';
import { DashboardPage } from '../dashboard';

describe('DashboardPage', () => {
  beforeAll(() => {
    jest.spyOn(useAuthModule, 'useAuth').mockReturnValue({
      user: {
        id: '1',
        email: 'test@example.com',
        user_metadata: { avatar_url: '', full_name: 'Test User' },
        app_metadata: {},
        aud: '',
        created_at: '',
      },
      session: {
        access_token: 'token',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: '1',
          email: 'test@example.com',
          user_metadata: { avatar_url: '', full_name: 'Test User' },
          app_metadata: {},
          aud: '',
          created_at: '',
        },
      },
      error: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    });
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('renders dashboard page', () => {
    render(
      <MantineProvider>
        <DashboardPage />
      </MantineProvider>
    );
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
