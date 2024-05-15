import { AdaAdjudicationDetails, AdaIntercept, Adjustment } from '../@types/adjustmentsApi/types'
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

  async getAdaIntercept(person: string, activeCaseLoadId: string): Promise<AdaIntercept> {
    const details = await (this.restClient.get({
      path: `/adjustments/additional-days/${person}/adjudication-details?service=${config.featureToggles.defaultAdaApi}`,
      headers: { 'Active-Caseload': activeCaseLoadId },
    }) as Promise<AdaAdjudicationDetails>)
    return details.intercept
  }
}
