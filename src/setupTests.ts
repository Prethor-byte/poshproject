// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia for ThemeProvider and responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock layout components to avoid unnecessary context issues
const React = require('react');
jest.mock('@/components/layout/navbar', () => ({ Navbar: () => React.createElement('nav', { 'data-testid': 'navbar' }) }));
jest.mock('@/components/layout/footer', () => ({ Footer: () => React.createElement('footer', { 'data-testid': 'footer' }) }));
jest.mock('@/components/compliance/cookie-banner', () => ({ CookieBanner: () => React.createElement('div', { 'data-testid': 'cookie-banner' }) }));
jest.mock('@/components/layout/page-transition', () => ({ PageTransition: ({ children }: any) => React.createElement(React.Fragment, null, children) }));
