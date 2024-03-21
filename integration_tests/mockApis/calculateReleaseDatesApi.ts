import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetLatestCalculation: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/crd-api/calculation/A1234AB/latest',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          prisonerId: 'string',
          bookingId: 0,
          calculatedAt: '2024-03-21T13:35:18.277Z',
          calculationRequestId: 0,
          establishment: 'string',
          reason: 'string',
          source: 'NOMIS',
          dates: [
            {
              type: 'CRD',
              description: 'string',
              date: '2024-03-21',
              hints: [
                {
                  text: 'string',
                  link: 'string',
                },
              ],
            },
          ],
        },
      },
    })
  },
}
