import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'
import PrisonerSearchService from './prisonerSearchService'
import PrisonerService from './prisonerService'
import AdjustmentsService from './adjustmentsService'
import CalculateReleaseDatesService from './calculateReleaseDatesService'
import RemandAndSentencingService from './remandAndSentencingService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, feComponentsClient } = dataAccess()

  const feComponentsService = new FeComponentsService(feComponentsClient)

  const prisonerService = new PrisonerService(hmppsAuthClient)

  const userService = new UserService(manageUsersApiClient, prisonerService)

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)

  const adjustmentsService = new AdjustmentsService(hmppsAuthClient)

  const calculateReleaseDatesService = new CalculateReleaseDatesService()

  const remandAndSentencingService = new RemandAndSentencingService(hmppsAuthClient)

  return {
    applicationInfo,
    userService,
    feComponentsService,
    prisonerService,
    prisonerSearchService,
    adjustmentsService,
    calculateReleaseDatesService,
    remandAndSentencingService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
