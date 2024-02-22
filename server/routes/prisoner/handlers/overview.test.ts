import { Express } from 'express'

import request from 'supertest'
import PrisonerService from '../../../services/prisonerService'
import { appWithAllRoutes } from '../../testutils/appSetup'
import { Prisoner } from '../../../@types/prisonerSearchApi/types'
import PrisonerSearchService from '../../../services/prisonerSearchService'
import { CourtEventDetails } from '../../../@types/prisonApi/types'
import AdjustmentsService from '../../../services/adjustmentsService'
import { Adjustment } from '../../../@types/adjustmentsApi/types'

jest.mock('../../../services/prisonerService')
jest.mock('../../../services/prisonerSearchService')
jest.mock('../../../services/adjustmentsService')

const prisonerService = new PrisonerService(null) as jest.Mocked<PrisonerService>
const prisonerSearchService = new PrisonerSearchService(null) as jest.Mocked<PrisonerSearchService>
const adjustmentsService = new AdjustmentsService() as jest.Mocked<AdjustmentsService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      prisonerService,
      prisonerSearchService,
      adjustmentsService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Route Handlers - Overview', () => {
  it('should render next-court-hearing section when all details are populated', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({
      caseReference: 'TS0001',
      startTime: '2025-02-08T15:55:54',
      courtLocation: 'The Old Bailey',
      courtEventType: 'Court Appearance',
    } as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([])

    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h3 class="govuk-heading-m">Next court hearing</h3>')
        expect(res.text).toMatch(/Case reference\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*TS0001/)
        expect(res.text).toMatch(/Location\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*The Old Bailey/)
        expect(res.text).toMatch(/Hearing type\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*Court Appearance/)
        expect(res.text).toMatch(
          /Date\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*Saturday, 08 February 2025 at 15:55/,
        )
        expect(res.text).not.toContain('No upcoming court hearings.')
      })
  })

  it('should render next-court-hearing section correctly with no case reference', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({
      startTime: '2025-02-08T15:55:54',
      courtLocation: 'The Old Bailey',
      courtEventType: 'Court Appearance',
    } as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([])

    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toMatch(/Case reference\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*Not entered/)
      })
  })

  it('should render next-court-hearing section correctly if no court hearing', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([])

    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h3 class="govuk-heading-m">Next court hearing</h3>')
        expect(res.text).toContain('No upcoming court hearing.')
      })
  })

  it('should render service header', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([])

    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Court cases and release dates')
      })
  })

  it('should render adjustments section correctly if no adjustments', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
      prisonerNumber: 'A12345B',
      firstName: 'Jane',
      lastName: 'Doe',
    } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([])
    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h3 class="govuk-heading-m">Adjustments</h3>')
        expect(res.text).toContain('There are no active adjustments for Jane Doe')
      })
  })

  it('should render adjustments section correctly when there are adjustments', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
      prisonerNumber: 'A12345B',
      firstName: 'Jane',
      lastName: 'Doe',
    } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([
      {
        adjustmentTypeText: 'Remand',
        days: 5,
      } as Adjustment,
      {
        adjustmentTypeText: 'Remand',
        days: 10,
      } as Adjustment,
      {
        adjustmentTypeText: 'UAL',
        days: 6,
      } as Adjustment,
      {
        adjustmentTypeText: 'RADA',
        days: 1,
      } as Adjustment,
      {
        adjustmentTypeText: 'Tagged bail',
        days: 0,
      } as Adjustment,
    ])
    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h3 class="govuk-heading-m">Adjustments</h3>')
        expect(res.text).toMatch(/Remand\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*15 Days/)
        expect(res.text).toMatch(/UAL\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*6 Days/)
        expect(res.text).toMatch(/RADA\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*1 Day/)
        expect(res.text).not.toMatch(/Tagged bail\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*0 Days/)
        expect(res.text).not.toContain('There are no active adjustments for Jane Doe')
      })
  })

  it('do not include special remission or lawfully at large adjustments', () => {
    prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
      prisonerNumber: 'A12345B',
      firstName: 'Jane',
      lastName: 'Doe',
    } as Prisoner)
    prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
    adjustmentsService.getAdjustments.mockResolvedValue([
      {
        adjustmentType: 'LAWFULLY_AT_LARGE',
        adjustmentTypeText: 'Lawfully at large',
        days: 5,
      } as Adjustment,
      {
        adjustmentType: 'SPECIAL_REMISSION',
        adjustmentTypeText: 'Special remission',
        days: 10,
      } as Adjustment,
    ])
    return request(app)
      .get('/prisoner/A12345B/overview')
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('<h3 class="govuk-heading-m">Adjustments</h3>')
        expect(res.text).toContain('There are no active adjustments for Jane Doe')
      })
  })
})
