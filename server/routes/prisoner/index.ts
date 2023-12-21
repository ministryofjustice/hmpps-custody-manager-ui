import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import getPrisoner from '../../middleware/getPrisoner'
import AdjustmentsRoutes from './handlers/adjustments'
import CourtCasesRoutes from './handlers/courtCases'
import ImageRoutes from './handlers/image'
import OverviewRoutes from './handlers/overview'
import ReleaseDatesRoutes from './handlers/releaseDates'

export default function Index({ prisonerService, prisonerSearchService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) =>
    router.get(path, getPrisoner(prisonerSearchService), asyncMiddleware(handler))

  router.get('/image', new ImageRoutes(prisonerService).GET)

  get('/:prisonerNumber/adjustments', new AdjustmentsRoutes().GET)
  get('/:prisonerNumber/court-cases', new CourtCasesRoutes().GET)
  get('/:prisonerNumber/overview', new OverviewRoutes().GET)
  get('/:prisonerNumber/release-dates', new ReleaseDatesRoutes().GET)

  return router
}
