import { Request, Response } from 'express'
import { IsNotEmpty } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import PrisonerSearchService from '../../../services/prisonerSearchService'

export class PrisonerSearch {
  @IsNotEmpty({ message: 'You must enter a name or prison number in the format A1234CD' })
  query: string

  page: number = 0
}

export default class PrisonerOverviewRoutes {
  constructor(private readonly prisonerSearchService: PrisonerSearchService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { username, activeCaseLoadId } = res.locals.user
    const prisonerSearch = plainToInstance(PrisonerSearch, req.query)

    if (prisonerSearch.query) {
      const resultsPage = await this.prisonerSearchService.searchPrisoners(
        username,
        activeCaseLoadId,
        prisonerSearch.query,
        prisonerSearch.page,
      )
      return res.render('pages/prisoner/search', { resultsPage, prisonerSearch })
    }

    return res.render('pages/prisoner/search', { prisonerSearch })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.body
    return res.redirect(`?query=${query}`)
  }
}
