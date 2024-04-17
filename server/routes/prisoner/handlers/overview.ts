import { Request, Response } from 'express'
import { LatestCalculationCardConfig } from 'hmpps-court-cases-release-dates-design/hmpps/@types'
import PrisonerService from '../../../services/prisonerService'
import AdjustmentsService from '../../../services/adjustmentsService'
import config from '../../../config'
import CalculateReleaseDatesService from '../../../services/calculateReleaseDatesService'

export default class OverviewRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly adjustmentsService: AdjustmentsService,
    private readonly calculateReleaseDatesService: CalculateReleaseDatesService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req
    const { token } = res.locals.user
    const activeCourtCaseCount = await this.prisonerService.getActiveCourtCaseCount(
      prisoner.bookingId as unknown as number,
      token,
    )
    if (activeCourtCaseCount === 0) {
      return res.render('pages/prisoner/noCourtCases', { prisoner })
    }

    if (res.locals.user.hasAdjustmentsAccess === true) {
      const [nextCourtEvent, adjustments, adaIntercept, latestCalculationConfig] = await Promise.all([
        this.prisonerService.getNextCourtEvent(prisoner.bookingId as unknown as number, token),
        this.adjustmentsService.getAdjustments(prisoner.prisonerNumber, token),
        this.adjustmentsService.getAdaIntercept(prisoner.prisonerNumber, token),
        this.calculateReleaseDatesService.getLatestCalculationForPrisoner(prisoner.prisonerNumber, token),
      ])

      const isIndeterminateAndHasNoCalculatedDates =
        !latestCalculationConfig?.dates?.length &&
        (await this.calculateReleaseDatesService.hasIndeterminateSentences(
          prisoner.bookingId as unknown as number,
          token,
        ))

      const aggregatedAdjustments = adjustments
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

      return res.render('pages/prisoner/overview', {
        prisoner,
        nextCourtEvent,
        aggregatedAdjustments,
        adaIntercept,
        latestCalculationConfig,
        isIndeterminateAndHasNoCalculatedDates,
      })
    }
    return res.redirect(`${config.calculateReleaseDatesUiUrl}?prisonId=${prisoner.prisonerNumber}`)
  }

  private datesDontExistInCalc(latestCalculationConfig: LatestCalculationCardConfig): boolean {
    return (
      latestCalculationConfig === undefined ||
      latestCalculationConfig.dates === null ||
      latestCalculationConfig.dates === undefined ||
      latestCalculationConfig.dates.length === 0
    )
  }
}
