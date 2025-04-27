import { render, screen } from '@testing-library/react';
import { Toast, ToastProvider, ToastTitle, ToastDescription, ToastViewport } from '../toast';

describe('Toast', () => {
  it('renders toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>It worked!</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('It worked!')).toBeInTheDocument();
  });
});
