import { compareDesc, formatDistanceStrict, FormatDistanceStrictOptions } from 'date-fns'
import RemandAndSentencingApiClient from '../data/remandAndSentencingApiClient'
import { ApiRecall, getRecallType, Recall } from '../@types/remandAndSentencingApi/remandAndSentencingTypes'

export default class RemandAndSentencingService {
  async getMostRecentRecall(nomsId: string, token: string): Promise<Recall> {
    const client = new RemandAndSentencingApiClient(token)
    const allApiRecalls = await client.getAllRecalls(nomsId)
    const options: FormatDistanceStrictOptions = { unit: 'day', roundingMethod: 'trunc' }

    allApiRecalls.sort((a, b) => compareDesc(a.revocationDate, b.revocationDate))

    const mostRecent: ApiRecall = allApiRecalls.find(Boolean)

    return mostRecent
      ? {
          recallId: mostRecent.recallUuid,
          recallDate: mostRecent.revocationDate ? new Date(mostRecent.revocationDate) : null,
          returnToCustodyDate: mostRecent.returnToCustodyDate ? new Date(mostRecent.returnToCustodyDate) : null,
          recallType: getRecallType(mostRecent.recallType),
          // TODO UAL should be stored on the recall in RaS not calculated on the fly
          ual: formatDistanceStrict(mostRecent.revocationDate, mostRecent.returnToCustodyDate, options),
          location: mostRecent.createdByPrison,
        }
      : undefined
  }
}
