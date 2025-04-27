import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert', () => {
  it('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning alert</AlertDescription>
      </Alert>
    );
    // There may be multiple elements with the text 'Warning', so use getAllByText
    const titles = screen.getAllByText(/warning/i);
    expect(titles.length).toBeGreaterThanOrEqual(1);
    // Ensure the AlertTitle is rendered as an h5
    expect(titles[0].tagName).toBe('H5');
    expect(screen.getByText(/this is a warning alert/i)).toBeInTheDocument();
  });

  it('supports destructive variant styling', () => {
    render(<Alert variant="destructive">Danger!</Alert>);
    const alert = screen.getByRole('alert');
    // The destructive variant applies 'border-destructive/50' and 'text-destructive', not 'destructive' class directly
    expect(alert.className).toMatch(/border-destructive\/50/);
    expect(alert.className).toMatch(/text-destructive/);
  });
});
