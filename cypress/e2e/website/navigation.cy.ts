/// <reference types="cypress" />
// E2E test for website navigation

describe('Website Navigation', () => {
  const navLinks = [
    { label: /pricing/i, path: '/pricing' },
    { label: /blog/i, path: '/blog' },
    { label: /privacy|terms|legal/i, path: /privacy|terms|legal/ },
  ];

  beforeEach(() => {
    cy.visit('/');
  });

  navLinks.forEach(link => {
    it(`navigates to ${link.label} page`, () => {
      cy.findAllByRole('link').filter(`:contains(${link.label.source})`).first().click({ force: true });
      if (typeof link.path === 'string') {
        cy.url().should('include', link.path);
      } else {
        cy.url().should('match', link.path);
      }
      cy.findByRole('heading').should('exist');
    });
  });
});
