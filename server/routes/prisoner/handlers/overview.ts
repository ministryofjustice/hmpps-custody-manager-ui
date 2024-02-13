import { Request, Response } from 'express'
import PrisonerService from '../../../services/prisonerService'

export default class OverviewRoutes {
  constructor(private readonly prisonerService: PrisonerService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req
    const { token } = res.locals.user
    const nextCourtEvent = await this.prisonerService.getNextCourtEvent(prisoner.bookingId as unknown as number, token)

    res.render('pages/prisoner/overview', { prisoner, nextCourtEvent })
  }
}
