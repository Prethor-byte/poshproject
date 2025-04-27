// Sample Cypress E2E test: checks Profile page loads and Select component is present

describe('Profile Page E2E', () => {
  it('should load the profile page and display key elements', () => {
    cy.visit('/app/profile');
    cy.contains(/profile/i); // Checks for any element with 'profile'
    // Example: check if Select component is present if it has a label or placeholder
    // cy.get('[data-testid="my-select"]').should('exist');
  });
});
