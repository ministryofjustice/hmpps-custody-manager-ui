Cypress.Commands.add('signIn', (options = { failOnStatusCode: true }) => {
  cy.request('/prisoner/A1234AB/overview')
  return cy.task('getSignInUrl').then((url: string) => cy.visit(url, options))
})
