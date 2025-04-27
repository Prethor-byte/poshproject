/// <reference types="cypress" />
// E2E test for website navigation

describe('Website Navigation', () => {
  const navLinks = [
    { label: /privacy policy/i, path: '/legal/privacy' },
    { label: /start free trial/i, path: '/register' },
    { label: /get started/i, path: '/register' },
    { label: /poshauto logo/i, path: '/' },
  ];

  beforeEach(() => {
    cy.visit('/');
  });

  navLinks.forEach(link => {
    it(`navigates to ${link.label} page`, () => {
      cy.contains('a', link.label.source.replace(/\//g, '').replace(/\^|\$/g, '').replace(/\|.*/g, '')).click({ force: true });
      if (typeof link.path === 'string') {
        cy.url().should('include', link.path);
      } else {
        cy.url().should('match', link.path);
      }
      cy.get('h1, h2, h3').should('exist');
    });
  });
});
