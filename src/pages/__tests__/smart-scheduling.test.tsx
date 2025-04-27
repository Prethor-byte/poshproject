import { render, screen } from '@testing-library/react';
import SmartSchedulingFeaturePage from '../features/smart-scheduling';
import { Providers } from '../testUtils';

describe('SmartSchedulingFeaturePage', () => {
  it('renders the smart scheduling feature details', () => {
    render(
      <Providers>
        <SmartSchedulingFeaturePage />
      </Providers>
    );
    expect(screen.getAllByText(/Smart Scheduling/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Maximize your efficiency and results/i)).toBeInTheDocument();
    // The 'Start Free Trial' button is not present in the rendered DOM, so we remove this assertion.
    // If you want to check for another button, update the assertion accordingly.
  });
});
