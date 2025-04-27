/// <reference types="cypress" />
// E2E test for website legal pages

describe('Website Legal Pages', () => {
  const legalPages = [
    { label: /privacy/i, path: '/legal/privacy' },
    { label: /terms/i, path: '/legal/terms' }
  ];

  legalPages.forEach(page => {
    it(`loads the ${page.label} page`, () => {
      cy.visit(page.path);
      cy.findByRole('heading', { name: page.label }).should('exist');
      cy.contains(/policy|terms/i).should('exist');
    });
  });
});
