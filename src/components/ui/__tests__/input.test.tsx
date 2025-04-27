import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Input } from '../input';
import { act } from 'react-dom/test-utils';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText(/type here/i)).toBeInTheDocument();
  });

  it('accepts a value and onChange', async () => {
    const handleChange = jest.fn();
    render(<Input value="abc" onChange={handleChange} />);
    const input = screen.getByDisplayValue('abc');
    await act(async () => {
      await userEvent.type(input, 'def');
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText(/disabled/i)).toBeDisabled();
  });

  it('supports aria-label for accessibility', () => {
    render(<Input aria-label="Test input" />);
    expect(screen.getByLabelText(/test input/i)).toBeInTheDocument();
  });
});
