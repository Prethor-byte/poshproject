import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '../button';
import { act } from 'react-dom/test-utils';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('rounded-md'); // basic style check
  });

  it('supports variants', () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole('button', { name: /delete/i });
    expect(btn.className).toMatch(/destructive/);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeDisabled();
  });

  it('calls onClick handler', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /press/i }));
    });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">Link</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toBeInTheDocument();
  });
});
