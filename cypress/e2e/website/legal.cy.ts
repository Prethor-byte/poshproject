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
      // Use actual heading text for robust check
      if (page.path === '/legal/privacy') {
        cy.contains('h1, h2, h3', 'Privacy Policy').should('exist');
      } else if (page.path === '/legal/terms') {
        cy.contains('h1, h2, h3', /Terms of Service|Terms/i).should('exist');
      }
      cy.contains(/policy|terms/i).should('exist');
    });
  });
});
