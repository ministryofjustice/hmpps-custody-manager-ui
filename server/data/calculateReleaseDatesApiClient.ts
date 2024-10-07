import {
  AnalyzedBookingAndSentenceAdjustments,
  AnalyzedSentenceAndOffences,
  LatestCalculation,
} from '../@types/calculateReleaseDatesApi/types'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'

export default class CalculateReleaseDatesApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'Calculate Release Dates API',
      config.apis.calculateReleaseDatesApi as ApiConfig,
      token,
    )
  }

  async getLatestCalculationForPrisoner(prisonerNumber: string): Promise<LatestCalculation> {
    return this.restClient.get({
      path: `/calculation/${prisonerNumber}/latest`,
    }) as Promise<LatestCalculation>
  }

  async getSentenceAndOffences(bookingId: number): Promise<AnalyzedSentenceAndOffences> {
    return this.restClient.get({
      path: `/sentence-and-offence-information/${bookingId}`,
    }) as Promise<AnalyzedSentenceAndOffences>
  }

  async getAdjustments(bookingId: number): Promise<AnalyzedBookingAndSentenceAdjustments> {
    return this.restClient.get({
      path: `/booking-and-sentence-adjustments/${bookingId}`,
    }) as Promise<AnalyzedBookingAndSentenceAdjustments>
  }

  hasIndeterminateSentences(bookingId: number): Promise<boolean> {
    return this.restClient.get({
      path: `/manual-calculation/${bookingId}/has-indeterminate-sentences`,
    }) as Promise<boolean>
  }
}
