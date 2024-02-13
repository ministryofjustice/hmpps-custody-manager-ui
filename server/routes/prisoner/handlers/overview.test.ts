import { Express } from 'express'

import request from 'supertest'
import PrisonerService from '../../../services/prisonerService'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { Prisoner } from '../../../@types/prisonerSearchApi/types'
import PrisonerSearchService from '../../../services/prisonerSearchService'
import { CourtEventDetails } from '../../../@types/prisonApi/types'

jest.mock('../../../services/prisonerService')
jest.mock('../../../services/prisonerSearchService')

const prisonerService = new PrisonerService(null) as jest.Mocked<PrisonerService>
const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      prisonerService,
      prisonerSearchService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Route Handlers - Overview', () => {
  describe('GET /', () => {
    it('should render next-court-hearing section', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({ caseReference: 'TS0001' } as CourtEventDetails)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('<h3 class="govuk-heading-m">Next court hearing</h3>')
          expect(res.text).toMatch(/Case reference\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*TS0001/)
        })
    })
  })
})
