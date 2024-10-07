import {
  LatestCalculationCardConfig,
  LatestCalculationCardDate,
  LatestCalculationCardDateHint,
} from 'hmpps-court-cases-release-dates-design/hmpps/@types'
import { LatestCalculation } from '../@types/calculateReleaseDatesApi/types'
import CalculateReleaseDatesApiClient from '../data/calculateReleaseDatesApiClient'
import logger from '../../logger'

export default class CalculateReleaseDatesService {
  async getLatestCalculationForPrisoner(prisonerNumber: string, token: string): Promise<LatestCalculationCardConfig> {
    try {
      const latestCalculation = await new CalculateReleaseDatesApiClient(token).getLatestCalculationForPrisoner(
        prisonerNumber,
      )
      return this.latestCalculationComponentConfig(latestCalculation)
    } catch (error) {
      logger.error(error)
      return undefined
    }
  }

  async hasIndeterminateSentences(bookingId: number, token: string): Promise<boolean> {
    return new CalculateReleaseDatesApiClient(token).hasIndeterminateSentences(bookingId)
  }

  async hasNewOrUpdatedSentenceOrAdjustments(bookingId: number, token: string): Promise<boolean> {
    const client = new CalculateReleaseDatesApiClient(token)
    const [sentenceAndOffences, adjustments] = await Promise.all([
      client.getSentenceAndOffences(bookingId),
      client.getAdjustments(bookingId),
    ])
    const filteredSentences = sentenceAndOffences.some((sentence: { sentenceAndOffenceAnalysis: string }) =>
      ['NEW', 'UPDATED'].includes(sentence.sentenceAndOffenceAnalysis),
    )
    // @ts-expect-error BookingAdjustments does exist
    const filteredBookingAdjustments = adjustments.bookingAdjustments.some((adjustment: { analysisResult: string }) =>
      ['NEW', 'UPDATED'].includes(adjustment.analysisResult),
    )
    // @ts-expect-error sentenceAdjustments does exist
    const filteredSentenceAdjustments = adjustments.sentenceAdjustments.some((adjustment: { analysisResult: string }) =>
      ['NEW', 'UPDATED'].includes(adjustment.analysisResult),
    )

    return filteredSentences || filteredSentenceAdjustments || filteredBookingAdjustments
  }

  private latestCalculationComponentConfig(latestCalculation: LatestCalculation): LatestCalculationCardConfig {
    const dates: LatestCalculationCardDate[] = Object.values(latestCalculation.dates).map(date => {
      const cardDate: LatestCalculationCardDate = {
        type: date.type,
        description: date.description,
        date: date.date,
        hints: date.hints.map(hint => {
          const cardHint: LatestCalculationCardDateHint = {
            text: hint.text,
            href: hint.link,
          }
          return cardHint
        }),
      }
      return cardDate
    })
    return {
      source: latestCalculation.source,
      calculatedAt: latestCalculation.calculatedAt,
      establishment: latestCalculation.establishment,
      reason: latestCalculation.reason,
      dates,
    }
  }
}
