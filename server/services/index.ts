import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'
import PrisonerSearchService from './prisonerSearchService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, feComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const feComponentsService = new FeComponentsService(feComponentsClient)

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)

  return {
    applicationInfo,
    userService,
    feComponentsService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
