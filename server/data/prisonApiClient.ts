import { Readable } from 'stream'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { CourtEventDetails, OffenderSentenceAndOffences, PrisonApiUserCaseloads } from '../@types/prisonApi/types'

export default class PrisonApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Prison API', config.apis.prisonApi as ApiConfig, token)
  }

  async getPrisonerImage(prisonerNumber: string): Promise<Readable> {
    return this.restClient.stream({
      path: `/api/bookings/offenderNo/${prisonerNumber}/image/data`,
    })
  }

  async getNextCourtEvent(bookingId: number): Promise<CourtEventDetails> {
    return (await this.restClient.get({ path: `/api/court/${bookingId}/next-court-event` })) as CourtEventDetails
  }

  async getActiveCourtCaseCount(bookingId: number): Promise<number> {
    return (await this.restClient.get({ path: `/api/court/${bookingId}/count-active-cases` })) as number
  }

  async getUsersCaseloads(): Promise<PrisonApiUserCaseloads[]> {
    return this.restClient.get({ path: `/api/users/me/caseLoads` }) as Promise<PrisonApiUserCaseloads[]>
  }

  async getSentencesAndOffences(bookingId: number): Promise<OffenderSentenceAndOffences[]> {
    return (await this.restClient.get({
      path: `/api/offender-sentences/booking/${bookingId}/sentences-and-offences`,
    })) as Promise<unknown> as Promise<OffenderSentenceAndOffences[]>
  }
}
