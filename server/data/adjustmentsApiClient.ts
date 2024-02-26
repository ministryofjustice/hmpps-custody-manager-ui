import { AdaIntercept, Adjustment } from '../@types/adjustmentsApi/types'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'

export default class AdjustmentApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Adjustments API Client', config.apis.adjustmentsApi as ApiConfig, token)
  }

  async getAdjustments(person: string): Promise<Adjustment[]> {
    return (await this.restClient.get({
      path: '/adjustments',
      query: {
        person,
      },
    })) as unknown as Promise<Adjustment[]>
  }

  async getAdaIntercept(person: string): Promise<AdaIntercept> {
    return (await this.restClient.get({
      path: `/adjustments/${person}/intercept`,
    })) as unknown as Promise<AdaIntercept>
  }
}
