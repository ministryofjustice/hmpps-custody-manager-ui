import { compareDesc, formatDistanceStrict, FormatDistanceStrictOptions } from 'date-fns'
import { HmppsAuthClient } from '../data'
import RemandAndSentencingApiClient from '../data/remandAndSentencingApiClient'
import { ApiRecall, Recall, RecallTypes } from '../@types/remandAndSentencingApi/remandAndSentencingTypes'

export default class RemandAndSentencingService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getMostRecentRecall(nomsId: string, token: string): Promise<Recall> {
    const client = new RemandAndSentencingApiClient(token)
    const allApiRecalls = await client.getAllRecalls(nomsId)
    const options: FormatDistanceStrictOptions = { unit: 'day', roundingMethod: 'trunc' }

    allApiRecalls.sort((a, b) => compareDesc(a.recallDate, b.recallDate))

    const mostRecent: ApiRecall = allApiRecalls.find(Boolean)

    return {
      recallDate: new Date(mostRecent.recallDate),
      returnToCustodyDate: new Date(mostRecent.returnToCustodyDate),
      recallType: RecallTypes[mostRecent.recallType],
      // TODO UAL should be stored on the recall in RaS not calculated on the fly
      ual: formatDistanceStrict(mostRecent.recallDate, mostRecent.returnToCustodyDate, options),
    }
  }

  // private async getSystemClientToken(username: string): Promise<string> {
  //   return this.hmppsAuthClient.getSystemClientToken(username)
  // }
}
