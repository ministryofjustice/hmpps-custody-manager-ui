import { Readable } from 'stream'
import PrisonApiClient from '../data/prisonApiClient'
import { HmppsAuthClient } from '../data'
import { CourtEventDetails, PrisonApiUserCaseloads } from '../@types/prisonApi/types'

export default class PrisonerService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPrisonerImage(username: string, prisonerNumber: string): Promise<Readable> {
    return new PrisonApiClient(await this.getSystemClientToken(username)).getPrisonerImage(prisonerNumber)
  }

  async getNextCourtEvent(bookingId: number, token: string): Promise<CourtEventDetails> {
    return new PrisonApiClient(token).getNextCourtEvent(bookingId)
  }

  async getActiveCourtCaseCount(bookingId: number, token: string): Promise<number> {
    return new PrisonApiClient(token).getActiveCourtCaseCount(bookingId)
  }

  async getUsersCaseloads(token: string): Promise<PrisonApiUserCaseloads[]> {
    return new PrisonApiClient(token).getUsersCaseloads()
  }

  async hasActiveSentences(bookingId: number, token: string): Promise<boolean> {
    const sentencesAndOffences = await new PrisonApiClient(token).getSentencesAndOffences(bookingId)
    return sentencesAndOffences.some(it => it.sentenceStatus === 'A')
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }
}
