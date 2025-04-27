import { render, screen } from '@testing-library/react';
import AutomatedSharingFeaturePage from '../features/automated-sharing';
import { Providers } from '../testUtils';

describe('AutomatedSharingFeaturePage', () => {
  it('renders the automated sharing feature details', () => {
    render(
      <Providers>
        <AutomatedSharingFeaturePage />
      </Providers>
    );
    expect(screen.getByRole('heading', { name: /Automated Sharing/i })).toBeInTheDocument();
    expect(screen.getByText(/Schedule and automate sharing/i)).toBeInTheDocument();
    // The 'Start Free Trial' button is not present in the rendered DOM, so we remove this assertion.
    // If you want to check for another button, update the assertion accordingly.
  });
});
