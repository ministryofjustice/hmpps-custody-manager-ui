import { Request, Response } from 'express'
import PrisonerService from '../../../services/prisonerService'

export default class PrisonerImageRoutes {
  constructor(private readonly prisonerService: PrisonerService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonerNumber } = req.params

    return this.prisonerService.getPrisonerImage(res.locals.user.username, prisonerNumber).then(data => {
      res.set('Cache-control', 'private, max-age=86400')
      res.removeHeader('pragma')
      res.type('image/jpeg')
      data.pipe(res)
    })
  }
}
