/// <reference types="cypress" />
// E2E test for website homepage using Cypress best practices

// Uses Cypress Testing Library for robust selectors
// Assumes @testing-library/cypress is set up in support/index.js

describe('Website Homepage', () => {
  it('loads successfully and displays main CTA', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.console, 'error').as('consoleError');
      }
    });
    // Check for main headline/CTA (update regex if needed)
    cy.contains('h1, h2, h3', /automation platform.*poshmark/i).should('exist');
    // Check for visible main call-to-action button
    cy.contains('a', /Get Started|Start Free Trial/).should('exist');
    // Ensure no uncaught errors
    cy.get('@consoleError').should('not.be.called');
  });
});
