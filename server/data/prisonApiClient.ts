import { Readable } from 'stream'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { CourtEventDetails } from '../@types/prisonApi/types'

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
}
