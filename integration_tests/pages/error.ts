import Page, { PageElement } from './page'

export default class ErrorPage extends Page {
  constructor() {
    super('The details for this person cannot be found')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')

  miniProfile = (): PageElement => cy.get('.mini-profile')
}
