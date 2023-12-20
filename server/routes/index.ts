import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import prisonerRoutes from './prisoner'
import PrisonerOverviewRoutes from './prisoner/handlers/prisonerSearch'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  const prisonerOverviewRoutes = new PrisonerOverviewRoutes(services.prisonerSearchService)

  get('/', prisonerOverviewRoutes.GET)
  post('/', prisonerOverviewRoutes.POST)

  router.use('/prisoner', prisonerRoutes(services))

  return router
}
