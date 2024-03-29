import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import prisonerRoutes from './prisoner'
import config from '../config'

export default function routes(services: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (_, res) => res.redirect(config.digitalPrisonServicesUrl))

  router.use('/prisoner', prisonerRoutes(services))

  return router
}
