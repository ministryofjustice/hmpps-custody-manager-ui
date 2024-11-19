import { Readable } from 'stream'
import PrisonApiClient from '../data/prisonApiClient'
import { HmppsAuthClient } from '../data'
import {
  CourtEventDetails,
  OffenderSentenceAndOffences,
  PrisonApiPrison,
  PrisonApiPrisonDetails,
  PrisonApiUserCaseloads,
} from '../@types/prisonApi/types'
import CourtCasesReleaseDatesApiClient from '../data/courtCasesReleaseDatesApiClient'
import { ThingsToDo } from '../@types/courtCasesReleaseDatesApi/types'

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

  async getStartOfSentenceEnvelope(bookingId: number, token: string): Promise<Date> {
    const sentencesAndOffences = await new PrisonApiClient(token).getSentencesAndOffences(bookingId)
    return this.findStartOfSentenceEvelope(sentencesAndOffences)
  }

  private findStartOfSentenceEvelope(sentences: OffenderSentenceAndOffences[]): Date {
    if (sentences.length) {
      return new Date(
        Math.min.apply(
          null,
          sentences.filter(it => it.sentenceStatus === 'A').map(it => new Date(it.sentenceDate)),
        ),
      )
    }
    return null
  }

  async hasActiveSentences(bookingId: number, token: string): Promise<boolean> {
    const sentencesAndOffences = await new PrisonApiClient(token).getSentencesAndOffences(bookingId)
    return sentencesAndOffences.some(it => it.sentenceStatus === 'A')
  }

  private async getSystemClientToken(username: string): Promise<string> {
    return this.hmppsAuthClient.getSystemClientToken(username)
  }

  async getActivePrisons(token: string): Promise<PrisonApiPrison[]> {
    return new PrisonApiClient(token).getActivePrisons()
  }

  async getPrisonsWithServiceCode(serviceCode: string): Promise<PrisonApiPrisonDetails[]> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return new PrisonApiClient(token).getPrisonsWithServiceCode(serviceCode)
  }

  async postServiceCodeForPrison(serviceCode: string, prisonId: string): Promise<PrisonApiPrisonDetails> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return new PrisonApiClient(token).postServiceCodeForPrison(serviceCode, prisonId)
  }

  async deleteServiceCodeForPrison(serviceCode: string, prisonId: string): Promise<PrisonApiPrisonDetails> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return new PrisonApiClient(token).deleteServiceCodeForPrison(serviceCode, prisonId)
  }

  async getThingsToDo(prisonerId: string): Promise<ThingsToDo> {
    const token = await this.hmppsAuthClient.getSystemClientToken()
    return new CourtCasesReleaseDatesApiClient(token).getThingsToDoForPrisoner(prisonerId)
  }
}
