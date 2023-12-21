import config from '../config'
import { HmppsAuthClient } from '../data'
import PrisonerSearchApiClient from '../data/prisonerSearchApiClient'
import { PagePrisoner, Prisoner } from '../@types/prisonerSearchApi/types'

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async searchPrisoners(
    username: string,
    prisonCode: string,
    query: string,
    page = 0,
    pageSize = config.apis.prisonerSearchApi.pageSize,
  ): Promise<PagePrisoner> {
    return new PrisonerSearchApiClient(await this.getSystemClientToken(username)).searchPrisoners(
      prisonCode,
      query,
      page,
      pageSize,
    )
  }

  async getByPrisonerNumber(username: string, prisonerNumber: string): Promise<Prisoner> {
    return new PrisonerSearchApiClient(await this.getSystemClientToken(username)).getByPrisonerNumber(prisonerNumber)
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }
}
