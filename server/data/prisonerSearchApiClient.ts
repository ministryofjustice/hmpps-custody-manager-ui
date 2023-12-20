import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { PagePrisoner, Prisoner, PrisonerSearchQuery } from '../@types/prisonerSearchApi/types'

export default class PrisonerSearchApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search API Client', config.apis.prisonerSearchApi as ApiConfig, token)
  }

  async searchPrisoners(prisonCode: string, query: string, page: number, pageSize: number): Promise<PagePrisoner> {
    return (await this.restClient.get({
      path: `/prison/${prisonCode}/prisoners`,
      query: {
        term: query,
        page,
        size: pageSize,
      } as PrisonerSearchQuery,
    })) as Promise<PagePrisoner>
  }

  async getByPrisonerNumber(prisonerNumber: string): Promise<Prisoner> {
    return (await this.restClient.get({
      path: `/prisoner/${prisonerNumber}`,
    })) as unknown as Promise<Prisoner>
  }
}
