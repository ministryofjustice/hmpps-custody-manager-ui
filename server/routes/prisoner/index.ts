import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import getPrisoner from '../../middleware/getPrisoner'
import PrisonerOverviewRoutes from './handlers/prisonerOverview'

export default function Index({ prisonerSearchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) =>
    router.get(path, getPrisoner(prisonerSearchService), asyncMiddleware(handler))

  const prisonerOverviewRoutes = new PrisonerOverviewRoutes()

  get('/:prisonerNumber', prisonerOverviewRoutes.GET)

  return router
}
