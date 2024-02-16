import { Request, Response } from 'express'
import PrisonerService from '../../../services/prisonerService'
import AdjustmentsService from '../../../services/adjustmentsService'

export default class OverviewRoutes {
  constructor(
    private readonly prisonerService: PrisonerService,
    private readonly adjustmentsService: AdjustmentsService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req
    const { token } = res.locals.user
    const [nextCourtEvent, adjustments] = await Promise.all([
      this.prisonerService.getNextCourtEvent(prisoner.bookingId as unknown as number, token),
      this.adjustmentsService.getAdjustments(prisoner.prisonerNumber, token),
    ])

    const aggregatedAdjustments = adjustments.reduce((previous: { [key: string]: number }, current) => {
      const total = (previous[current.adjustmentTypeText] ?? 0) + current.daysTotal
      let newAggregate = previous
      if (total) {
        // eslint-disable-next-line no-param-reassign
        newAggregate = ((previous[current.adjustmentTypeText] = total), previous)
      }
      return newAggregate
    }, {})

    res.render('pages/prisoner/overview', { prisoner, nextCourtEvent, aggregatedAdjustments })
  }
}
