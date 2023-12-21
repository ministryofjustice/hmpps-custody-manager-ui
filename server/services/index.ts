import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'
import PrisonerSearchService from './prisonerSearchService'
import PrisonerService from './prisonerService'

export const services = () => {
  const { applicationInfo, hmppsAuthClient, manageUsersApiClient, feComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const feComponentsService = new FeComponentsService(feComponentsClient)

  const prisonerService = new PrisonerService(hmppsAuthClient)

  const prisonerSearchService = new PrisonerSearchService(hmppsAuthClient)

  return {
    applicationInfo,
    userService,
    feComponentsService,
    prisonerService,
    prisonerSearchService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
