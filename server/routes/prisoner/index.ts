import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import getPrisoner from '../../middleware/getPrisoner'
import PrisonerOverviewRoutes from './handlers/prisonerOverview'
import PrisonerImageRoutes from './handlers/prisonerImage'

export default function Index({ prisonerService, prisonerSearchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) =>
    router.get(path, getPrisoner(prisonerSearchService), asyncMiddleware(handler))

  router.get('/:prisonerNumber/image', new PrisonerImageRoutes(prisonerService).GET)

  get('/:prisonerNumber', new PrisonerOverviewRoutes().GET)

  return router
}
