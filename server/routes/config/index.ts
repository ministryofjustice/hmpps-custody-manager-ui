import { Router } from 'express'
import { Services } from '../../services'
import ConfigRoutes from './ConfigRoutes'

export default function Index({ prisonerService }: Services): Router {
  const router = Router()

  router.get('/', new ConfigRoutes(prisonerService).getConfig)
  router.get('/update', new ConfigRoutes(prisonerService).update)
  router.post('/', new ConfigRoutes(prisonerService).postConfig)

  return router
}
