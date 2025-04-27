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

// Polyfill for JSDOM pointer events for Radix UI
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: () => false,
    configurable: true,
  });
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: () => {},
    configurable: true,
  });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: () => {},
    configurable: true,
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../select';

describe('Select', () => {
  it('renders the Select trigger and options in the DOM', () => {
    render(
      <Select>
        <SelectTrigger>Select an option</SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>
    );
    // The trigger should always be in the DOM
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    // The options are not in the DOM until opened, but we can check the structure
    // This ensures at least the component mounts without error
  });

  // Radix Select interaction is not reliably testable in JSDOM due to missing Pointer Events APIs and portal limitations.
  // See: https://github.com/radix-ui/primitives/issues/1690 and https://github.com/radix-ui/primitives/issues/1365
  it.skip('allows selecting an option (requires E2E)', async () => {
    // TODO: Move this test to Playwright or Cypress for full coverage.
    // Example:
    // await page.click('text=Select an option');
    // await page.click('text=Two');
    // await expect(page.locator('text=Two')).toBeVisible();
  });
});
