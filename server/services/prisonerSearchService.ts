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
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return new PrisonerSearchApiClient(token).searchPrisoners(prisonCode, query, page, pageSize)
  }

  async getByPrisonerNumber(username: string, prisonerNumber: string): Promise<Prisoner> {
    const token = await this.hmppsAuthClient.getSystemClientToken(username)
    return new PrisonerSearchApiClient(token).getByPrisonerNumber(prisonerNumber)
  }
}
