import { Request, Response } from 'express'
import PrisonerService from '../../../services/prisonerService'
import AdjustmentsService from '../../../services/adjustmentsService'
import config from '../../../config'

export default class OverviewRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly adjustmentsService: AdjustmentsService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req
    const { token } = res.locals.user
    if (res.locals.user.hasAdjustmentsAccess === true) {
      const [nextCourtEvent, adjustments, adaIntercept] = await Promise.all([
        this.prisonerService.getNextCourtEvent(prisoner.bookingId as unknown as number, token),
        this.adjustmentsService.getAdjustments(prisoner.prisonerNumber, token),
        this.adjustmentsService.getAdaIntercept(prisoner.prisonerNumber, token),
      ])

      const aggregatedAdjustments = adjustments
        .filter(adjustment => !['LAWFULLY_AT_LARGE', 'SPECIAL_REMISSION'].includes(adjustment.adjustmentType))
        .reduce((previous: { [key: string]: number }, current) => {
          const total = (previous[current.adjustmentTypeText] ?? 0) + current.days
          let newAggregate = previous
          if (total) {
            // eslint-disable-next-line no-param-reassign
            newAggregate = ((previous[current.adjustmentTypeText] = total), previous)
          }
          return newAggregate
        }, {})

      return res.render('pages/prisoner/overview', { prisoner, nextCourtEvent, aggregatedAdjustments, adaIntercept })
    }
    return res.redirect(`${config.calculateReleaseDatesUiUrl}?prisonId=${prisoner.prisonerNumber}`)
  }
}
