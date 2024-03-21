import { LatestCalculation } from '../@types/calculateReleaseDatesApi/types'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'

export default class CalculateReleaseDatesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'Calculate Release Dates API',
      config.apis.calculateReleaseDatesApi as ApiConfig,
      token,
    )
  }

  async getLatestCalculationForPrisoner(prisonerNumber: string): Promise<LatestCalculation> {
    return this.restClient.get({
      path: `/calculation/${prisonerNumber}/latest`,
    }) as Promise<LatestCalculation>
  }
}
