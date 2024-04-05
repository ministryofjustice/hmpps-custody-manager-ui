import { RequestHandler, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import getPrisoner from '../../middleware/getPrisoner'
import AdjustmentsRoutes from './handlers/adjustments'
import CourtCasesRoutes from './handlers/courtCases'
import ImageRoutes from './handlers/image'
import OverviewRoutes from './handlers/overview'
import ReleaseDatesRoutes from './handlers/releaseDates'
import setupUnparsedPath from '../../middleware/setupUnparsedPath'

export default function Index({
  prisonerService,
  prisonerSearchService,
  adjustmentsService,
  calculateReleaseDatesService,
}: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) =>
    router.get(path, getPrisoner(prisonerSearchService), setupUnparsedPath(), asyncMiddleware(handler))

  router.get('/:prisonerNumber/image', new ImageRoutes(prisonerService).GET)

  get('/:prisonerNumber/adjustments', new AdjustmentsRoutes().GET)
  get('/:prisonerNumber/court-cases', new CourtCasesRoutes().GET)
  get(
    '/:prisonerNumber/overview',
    new OverviewRoutes(prisonerService, adjustmentsService, calculateReleaseDatesService).GET,
  )
  get('/:prisonerNumber/release-dates', new ReleaseDatesRoutes().GET)

  return router
}
