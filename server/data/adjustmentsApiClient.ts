import { AdaAdjudicationDetails, AdaIntercept, Adjustment } from '../@types/adjustmentsApi/types'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'

export default class AdjustmentApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Adjustments API Client', config.apis.adjustmentsApi as ApiConfig, token)
  }

  async findByPerson(person: string, earliestSentenceDate?: string): Promise<Adjustment[]> {
    let url = `/adjustments?person=${person}`
    if (earliestSentenceDate) {
      url += `&sentenceEnvelopeDate=${earliestSentenceDate}`
    }
    return this.restClient.get({
      path: url,
    }) as Promise<Adjustment[]>
  }

  async getAdaIntercept(person: string, activeCaseLoadId: string): Promise<AdaIntercept> {
    const details = await (this.restClient.get({
      path: `/adjustments/additional-days/${person}/adjudication-details`,
      headers: { 'Active-Caseload': activeCaseLoadId },
    }) as Promise<AdaAdjudicationDetails>)
    return details.intercept
  }
}
