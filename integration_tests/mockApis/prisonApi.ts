import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetNextCourtEvent: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/prison-api/api/court/1234/next-court-event',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          eventId: 0,
          startTime: '2021-07-05T10:35:17',
          courtLocation: 'Aldershot',
          courtEventType: 'Sentencing',
          caseReference: 'A1473295B',
        },
      },
    })
  },
}