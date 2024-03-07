import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetPrisonerDetails: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prisoner-search-api/prisoner/A1234AB',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          prisonerNumber: 'A1234AB',
          bookingId: '1234',
          firstName: 'Marvin',
          lastName: 'Haggler',
          dateOfBirth: '1965-02-03',
          prisonId: 'MDI',
          status: 'ACTIVE IN',
          prisonName: 'HMP Prison',
          cellLocation: 'A-1-1',
        },
      },
    })
  },
}
