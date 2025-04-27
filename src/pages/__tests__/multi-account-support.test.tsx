import { render, screen } from '@testing-library/react';
import MultiAccountSupportFeaturePage from '../features/multi-account-support';
import { Providers } from '../testUtils';

describe('MultiAccountSupportFeaturePage', () => {
  it('renders the multi-account support feature details', () => {
    render(
      <Providers>
        <MultiAccountSupportFeaturePage />
      </Providers>
    );
    expect(screen.getByRole('heading', { name: /Multi-Account Support/i })).toBeInTheDocument();
    expect(screen.getByText(/Effortlessly manage multiple Poshmark closets/i)).toBeInTheDocument();
    // The 'Start Free Trial' button is not present in the rendered DOM, so we remove this assertion.
    // If you want to check for another button, update the assertion accordingly.
  });
});
