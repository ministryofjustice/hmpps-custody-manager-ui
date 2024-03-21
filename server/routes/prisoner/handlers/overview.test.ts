import { Express } from 'express'

import request from 'supertest'
import PrisonerService from '../../../services/prisonerService'
import { appWithAllRoutes, user } from '../../testutils/appSetup'
import { Prisoner } from '../../../@types/prisonerSearchApi/types'
import PrisonerSearchService from '../../../services/prisonerSearchService'
import { CourtEventDetails } from '../../../@types/prisonApi/types'
import AdjustmentsService from '../../../services/adjustmentsService'
import { AdaIntercept, Adjustment } from '../../../@types/adjustmentsApi/types'
import config from '../../../config'

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
    userSupplier: () => {
      return { ...user, hasAdjustmentsAccess: true }
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Route Handlers - Overview', () => {
  describe('Layout tests for overview', () => {
    it('should render prisoner details', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        imprisonmentStatusDescription: 'Life imprisonment',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('data-qa="mini-profile-prisoner-number">A12345B')
          expect(res.text).toContain('mini-profile-status">Life imprisonment<')
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

    it('should render sub nav', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({ prisonerNumber: 'A12345B' } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Overview')
          expect(res.text).toContain('Adjustments')
          expect(res.text).toContain('Release dates and calculations')
        })
    })
  })

  describe('Next Court Hearing tests', () => {
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
          expect(res.text).toContain('<h2 class="govuk-heading-l">Next court hearing</h2>')
          expect(res.text).toMatch(/Case reference\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*TS0001/)
          expect(res.text).toMatch(/Location\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*The Old Bailey/)
          expect(res.text).toMatch(/Hearing type\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*Court Appearance/)
          expect(res.text).toMatch(
            /Date\s*<\/dt>\s*<dd class="govuk-summary-list__value">\s*Saturday, 08 February 2025 at 15:55/,
          )
          expect(res.text).not.toContain('There are no upcoming court hearings')
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
          expect(res.text).toContain('<h2 class="govuk-heading-l">Next court hearing</h2>')
          expect(res.text).toContain('There are no upcoming court hearings')
        })
    })
  })

  describe('Adjustments tests for overview', () => {
    it('should render adjustments section correctly if no adjustments', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])
      adjustmentsService.getAdaIntercept.mockResolvedValue({} as AdaIntercept)
      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('<h2 class="govuk-heading-l">Adjustments</h2>')
          expect(res.text).toContain('There are no active adjustments for Jane Doe')
          expect(res.text).toContain('<h1 class="govuk-heading-xl">Overview</h1>')
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
          adjustmentArithmeticType: 'DEDUCTION',
          days: 5,
        } as Adjustment,
        {
          adjustmentTypeText: 'Remand',
          adjustmentArithmeticType: 'DEDUCTION',
          days: 10,
        } as Adjustment,
        {
          adjustmentTypeText: 'UAL',
          adjustmentArithmeticType: 'ADDITION',
          days: 6,
        } as Adjustment,
        {
          adjustmentTypeText: 'RADA',
          adjustmentArithmeticType: 'DEDUCTION',
          days: 1,
        } as Adjustment,
        {
          adjustmentTypeText: 'Tagged bail',
          adjustmentArithmeticType: 'DEDUCTION',
          days: 0,
        } as Adjustment,
        {
          adjustmentTypeText: 'Unused deductions',
          adjustmentArithmeticType: 'NONE',
          days: 5,
        } as Adjustment,
      ])
      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('<h2 class="govuk-heading-l">Adjustments</h2>')
          expect(res.text).toContain('<h3 class="govuk-heading-m">Additions</h3>')
          expect(res.text).toContain('<h3 class="govuk-heading-m">Deductions</h3>')
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
          adjustmentArithmeticType: 'NONE',
          days: 5,
        } as Adjustment,
        {
          adjustmentType: 'SPECIAL_REMISSION',
          adjustmentTypeText: 'Special remission',
          adjustmentArithmeticType: 'NONE',
          days: 10,
        } as Adjustment,
      ])
      adjustmentsService.getAdaIntercept.mockResolvedValue({} as AdaIntercept)
      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('<h2 class="govuk-heading-l">Adjustments</h2>')
          expect(res.text).toContain('There are no active adjustments for Jane Doe')
        })
    })
  })

  describe('Adjustment intercept tests', () => {
    it('should display correct message if intercept type is UPDATE', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      adjustmentsService.getAdaIntercept.mockResolvedValue({ type: 'UPDATE' } as AdaIntercept)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Before you continue, you must')
          expect(res.text).toContain('review the updated ADA information')
        })
    })

    it('should display correct message if intercept type is FIRST_TIME', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      adjustmentsService.getAdaIntercept.mockResolvedValue({ type: 'FIRST_TIME' } as AdaIntercept)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Before you continue, you must')
          expect(res.text).toContain('review existing ADA information')
        })
    })

    it('should display correct message if intercept type is PADA', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      adjustmentsService.getAdaIntercept.mockResolvedValue({ type: 'PADA' } as AdaIntercept)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('Before you continue, you must')
          expect(res.text).toContain('review prospective ADA information')
        })
    })

    it('should display correct message if intercept type is NONE', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      adjustmentsService.getAdaIntercept.mockResolvedValue({ type: 'NONE' } as AdaIntercept)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('review the updated ADA information')
          expect(res.text).not.toContain('review existing ADA information')
          expect(res.text).not.toContain('review prospective ADA information')
        })
    })
  })

  describe('Authorisation tests', () => {
    it('must redirect when user does not have access to adjustments', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        imprisonmentStatusDescription: 'Life imprisonment',
      } as Prisoner)
      app = appWithAllRoutes({
        services: {
          prisonerService,
          prisonerSearchService,
          adjustmentsService,
        },
        userSupplier: () => {
          return { ...user, hasAdjustmentsAccess: false }
        },
      })
      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect(302)
        .expect('Location', `${config.calculateReleaseDatesUiUrl}?prisonId=A12345B`)
    })
  })

  describe('Number of active court cases tests', () => {
    it('Zero active cases shows error page', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getActiveCourtCaseCount.mockResolvedValue(0)

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).toContain('<h1 class="govuk-heading-xl">There is a problem</h1>')
          expect(res.text).not.toContain('<h1 class="govuk-heading-xl">Overview</h1>')
        })
    })

    it('If there are active cases then error page is not shown', () => {
      prisonerSearchService.getByPrisonerNumber.mockResolvedValue({
        prisonerNumber: 'A12345B',
        firstName: 'Jane',
        lastName: 'Doe',
      } as Prisoner)
      prisonerService.getActiveCourtCaseCount.mockResolvedValue(1)
      prisonerService.getNextCourtEvent.mockResolvedValue({} as CourtEventDetails)
      adjustmentsService.getAdjustments.mockResolvedValue([])

      return request(app)
        .get('/prisoner/A12345B/overview')
        .expect('Content-Type', /html/)
        .expect(res => {
          expect(res.text).not.toContain('<h1 class="govuk-heading-xl">There is a problem</h1>')
          expect(res.text).toContain('<h1 class="govuk-heading-xl">Overview</h1>')
        })
    })
  })
})
