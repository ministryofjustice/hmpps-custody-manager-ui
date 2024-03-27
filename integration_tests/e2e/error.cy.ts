import ErrorPage from '../pages/error'
import Page from '../pages/page'

context('Error', () => {
  let errorPage: ErrorPage
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubManageUser')
    cy.task('stubGetPrisonerDetails')
    cy.task('stubGetUserDifferentCaseload')
    cy.signIn({ failOnStatusCode: false })
    errorPage = Page.verifyOnPage(ErrorPage)
  })

  it('Must display mini profile on page', () => {
    errorPage.miniProfile().should('exist')
  })
})
