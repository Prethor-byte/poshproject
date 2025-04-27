import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '../dialog';
import { act } from 'react-dom/test-utils';

describe('Dialog', () => {
  it('renders trigger and opens dialog content', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description here.</DialogDescription>
        </DialogContent>
      </Dialog>
    );
    // Trigger should be in the document
    expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument();
    // Dialog content should not be visible initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    // Open dialog by clicking trigger
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /open dialog/i }));
    });
    // Now dialog content should appear
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/dialog title/i)).toBeInTheDocument();
    expect(screen.getByText(/dialog description here/i)).toBeInTheDocument();
  });
});
