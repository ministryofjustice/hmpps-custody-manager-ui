import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { Prisoner } from '../@types/prisonerSearchApi/types'

export default class PrisonerSearchApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search API Client', config.apis.prisonerSearchApi as ApiConfig, token)
  }

  async getByPrisonerNumber(prisonerNumber: string): Promise<Prisoner> {
    return (await this.restClient.get({
      path: `/prisoner/${prisonerNumber}`,
    })) as unknown as Promise<Prisoner>
  }
}
