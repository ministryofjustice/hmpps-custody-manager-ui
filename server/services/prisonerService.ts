import { Readable } from 'stream'
import PrisonApiClient from '../data/prisonApiClient'
import { HmppsAuthClient } from '../data'
import { CourtEventDetails } from '../@types/prisonApi/types'

export default class PrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPrisonerImage(username: string, prisonerNumber: string): Promise<Readable> {
    return new PrisonApiClient(await this.getSystemClientToken(username)).getPrisonerImage(prisonerNumber)
  }

  async getNextCourtEvent(bookingId: number, token: string): Promise<CourtEventDetails> {
    return new PrisonApiClient(token).getNextCourtEvent(bookingId)
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }
}
