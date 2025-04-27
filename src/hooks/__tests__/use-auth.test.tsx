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
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../use-auth';

// This is a minimal smoke test for the hook. Full mocking of supabase is recommended for more thorough tests.
describe('useAuth', () => {
  it('returns default state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('signIn');
    expect(result.current).toHaveProperty('signOut');
  });
});
