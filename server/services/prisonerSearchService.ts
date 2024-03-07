import { HmppsAuthClient } from '../data'
import PrisonerSearchApiClient from '../data/prisonerSearchApiClient'
import { Prisoner } from '../@types/prisonerSearchApi/types'

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getByPrisonerNumber(username: string, prisonerNumber: string): Promise<Prisoner> {
    return new PrisonerSearchApiClient(await this.getSystemClientToken(username)).getByPrisonerNumber(prisonerNumber)
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }
}
