import { HmppsAuthClient } from '../data'
import { AdaIntercept, Adjustment } from '../@types/adjustmentsApi/types'
import AdjustmentApiClient from '../data/adjustmentsApiClient'

export default class AdjustmentsService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getAdjustments(person: string, earliestSentenceDate: Date, username: string): Promise<Adjustment[]> {
    return new AdjustmentApiClient(await this.getSystemClientToken(username)).findByPerson(
      person,
      earliestSentenceDate.toISOString().substring(0, 10),
    )
  }

  async getAdaIntercept(person: string, activeCaseLoadId: string, username: string): Promise<AdaIntercept> {
    return new AdjustmentApiClient(await this.getSystemClientToken(username)).getAdaIntercept(person, activeCaseLoadId)
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }
}
