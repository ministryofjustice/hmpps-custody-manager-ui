import { Request, Response } from 'express'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import PrisonerSearchService from '../../../services/prisonerSearchService'

export class PrisonerSearch {
  @Expose()
  @IsNotEmpty({ message: 'You must enter a name or prison number in the format A1234CD' })
  query: string
}

export default class PrisonerOverviewRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { username, activeCaseLoadId } = res.locals.user
    const { query } = req.query

    if (query && typeof query === 'string') {
      const page = await this.prisonerSearchService.searchPrisoners(username, activeCaseLoadId, query)
      return res.render('pages/prisoner/search', { page, query })
    }

    return res.render('pages/prisoner/search')
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.body
    return res.redirect(`?query=${query}`)
  }
}
