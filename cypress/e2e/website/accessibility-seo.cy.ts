/// <reference types="cypress" />
// E2E test for website accessibility and SEO basics

describe('Website Accessibility and SEO', () => {
  it('has a title and meta description', () => {
    cy.visit('/');
    cy.title().should('not.be.empty');
    cy.get('meta[name="description"]').should('have.attr', 'content').and('not.be.empty');
  });

  it('has no obvious accessibility violations (axe)', () => {
    cy.visit('/');
    // Requires cypress-axe plugin and injectAxe command
    cy.injectAxe();
    cy.checkA11y();
  });
});
