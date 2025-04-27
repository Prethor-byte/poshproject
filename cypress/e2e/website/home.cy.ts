/// <reference types="cypress" />
// E2E test for website homepage using Cypress best practices

// Uses Cypress Testing Library for robust selectors
// Assumes @testing-library/cypress is set up in support/index.js

describe('Website Homepage', () => {
  it('loads successfully and displays main CTA', () => {
    cy.visit('/');
    // Check for main headline/CTA
    cy.findByRole('heading', { name: /poshauto|automation|grow/i }).should('exist');
    // Check for visible main call-to-action button
    cy.findAllByRole('link').then(links => {
      const cta = [...links].filter(el => /get started|sign up|start free/i.test(el.textContent || ''));
      expect(cta.length).to.be.greaterThan(0);
    });
    // Ensure no uncaught errors
    cy.window().then(win => {
      cy.wrap(win.console.error).should('not.be.called');
    });
  });
});
