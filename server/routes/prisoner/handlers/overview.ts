import { Request, Response } from 'express'
import PrisonerService from '../../../services/prisonerService'
import AdjustmentsService from '../../../services/adjustmentsService'
import config from '../../../config'
import CalculateReleaseDatesService from '../../../services/calculateReleaseDatesService'
import { Prisoner } from '../../../@types/prisonerSearchApi/types'

export default class OverviewRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly adjustmentsService: AdjustmentsService,
    private readonly calculateReleaseDatesService: CalculateReleaseDatesService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req
    const { token, activeCaseLoadId, username, hasInactiveBookingAccess } = res.locals.user
    const bookingId = prisoner.bookingId as unknown as number
    const isPrisonerOutside = prisoner.prisonId === 'OUT'
    const isPrisonerBeingTransferred = prisoner.prisonId === 'TRN'
    const showAdjustments = !(hasInactiveBookingAccess && (isPrisonerOutside || isPrisonerBeingTransferred))

    if (res.locals.user.hasAdjustmentsAccess === true) {
      const startOfSentenceEnvelope = await this.prisonerService.getStartOfSentenceEnvelope(bookingId, token)
      const [nextCourtEvent, hasActiveSentences] = await Promise.all([
        this.prisonerService.getNextCourtEvent(bookingId, token),
        this.prisonerService.hasActiveSentences(bookingId, token),
      ])

      const adaIntercept = showAdjustments
        ? await this.adjustmentsService.getAdaIntercept(prisoner.prisonerNumber, activeCaseLoadId, username)
        : null

      const aggregatedAdjustments = showAdjustments
        ? await this.getAggregatedAdjustments(prisoner, startOfSentenceEnvelope, username)
        : null

      const latestCalculationConfig = hasActiveSentences
        ? await this.calculateReleaseDatesService.getLatestCalculationForPrisoner(prisoner.prisonerNumber, token)
        : null

      const isIndeterminateAndHasNoCalculatedDates =
        hasActiveSentences && !latestCalculationConfig?.dates?.length
          ? await this.calculateReleaseDatesService.hasIndeterminateSentences(bookingId, token)
          : false

      // TODO When feature flag is removed, add to the Promise.all above
      const requiresNewCalculation = config.featureFlags.thingsToDo
        ? await this.calculateReleaseDatesService.hasNewOrUpdatedSentenceOrAdjustments(bookingId, token)
        : false

      return res.render('pages/prisoner/overview', {
        prisoner,
        nextCourtEvent,
        aggregatedAdjustments,
        adaIntercept,
        latestCalculationConfig,
        isIndeterminateAndHasNoCalculatedDates,
        hasActiveSentences,
        showAdjustments,
        requiresNewCalculation,
      })
    }
    return res.redirect(`${config.calculateReleaseDatesUiUrl}?prisonId=${prisoner.prisonerNumber}`)
  }

  private async getAggregatedAdjustments(prisoner: Prisoner, startOfSentenceEnvelope: Date, username: string) {
    const adjustments = await this.adjustmentsService.getAdjustments(
      prisoner.prisonerNumber,
      startOfSentenceEnvelope,
      username,
    )

    return adjustments
      .filter(adjustment => !['LAWFULLY_AT_LARGE', 'SPECIAL_REMISSION'].includes(adjustment.adjustmentType))
      .reduce(
        (previous: { [arithmeticKey: string]: { [typeKey: string]: number } }, current) => {
          const total = (previous[current.adjustmentArithmeticType][current.adjustmentTypeText] ?? 0) + current.days
          let newAggregate = previous
          if (total) {
            newAggregate =
              // eslint-disable-next-line no-param-reassign
              ((previous[current.adjustmentArithmeticType][current.adjustmentTypeText] = total), previous)
          }
          return newAggregate
        },
        { ADDITION: {}, DEDUCTION: {}, NONE: {} },
      )
  }
}
