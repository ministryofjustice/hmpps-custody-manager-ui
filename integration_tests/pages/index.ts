import Page, { PageElement } from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Search for a prisoner to view their court cases, adjustments and release dates')
  }

  headerUserName = (): PageElement => cy.get('[data-qa=header-user-name]')

  headerPhaseBanner = (): PageElement => cy.get('[data-qa=header-phase-banner]')
}
