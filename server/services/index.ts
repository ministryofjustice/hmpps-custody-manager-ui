import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'
import PrisonerSearchService from './prisonerSearchService'
import PrisonerService from './prisonerService'
import AdjustmentsService from './adjustmentsService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, feComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const feComponentsService = new FeComponentsService(feComponentsClient)

  const prisonerService = new PrisonerService(hmppsAuthClient)

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)

  const adjustmentsService = new AdjustmentsService()

  return {
    applicationInfo,
    userService,
    feComponentsService,
    prisonerService,
    prisonerSearchService,
    adjustmentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
