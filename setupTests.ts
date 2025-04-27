import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for jsdom (used by framer-motion and others)
beforeAll(() => {
  if (typeof global.IntersectionObserver === 'undefined') {
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
    };
  }
});

// Polyfill window.matchMedia for jsdom (used by ThemeProvider, Mantine, etc.)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function (query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}

