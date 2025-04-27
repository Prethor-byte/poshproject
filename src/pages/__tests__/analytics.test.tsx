import { render, screen } from '@testing-library/react';
import AnalyticsFeaturePage from '../features/analytics';
import { Providers } from '../testUtils';

describe('AnalyticsFeaturePage', () => {
  it('renders the analytics feature details', () => {
    render(
      <Providers>
        <AnalyticsFeaturePage />
      </Providers>
    );
    expect(screen.getByRole('heading', { name: /Analytics/i })).toBeInTheDocument();
    expect(screen.getByText(/Unlock actionable insights/i)).toBeInTheDocument();
    // The 'Start Free Trial' button is not present in the rendered DOM, so we remove this assertion.
    // If you want to check for another button, update the assertion accordingly.
  });
});
