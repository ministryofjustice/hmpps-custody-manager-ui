import { Request, Response } from 'express'

export default class AdjustmentsRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req

    res.render('pages/prisoner/adjustments', { prisoner })
  }
}
