import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import config from '../config'

describe('Route Handlers - Index', () => {
  it('should redirect to dps', () => {
    const app = appWithAllRoutes({})
    return request(app).get('/').expect(302).expect('Location', config.applications.digitalPrisonServices.url)
  })
})
