import { render, screen } from '@testing-library/react';
import { HomePage } from '../home';
import { Providers } from '../testUtils';

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ user: { email: 'test@example.com' } })
}));

describe('HomePage', () => {
  it('renders welcome message and dashboard sections', () => {
    render(
      <Providers>
        <HomePage />
      </Providers>
    );
    expect(screen.getByText(/Welcome back, test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Activity Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Recent Activity/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Analytics Overview/i).length).toBeGreaterThan(0);
  });
});
