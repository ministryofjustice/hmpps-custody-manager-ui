import { Adjustment } from '../@types/adjustmentsApi/types'
import AdjustmentApiClient from '../data/adjustmentsApiClient'

export default class AdjustmentsService {
  async getAdjustments(person: string, token: string): Promise<Adjustment[]> {
    return new AdjustmentApiClient(token).getAdjustments(person)
  }
}
