import { dataAccess } from '../data'
import UserService from './userService'
import FeComponentsService from './feComponentsService'

export const services = () => {
  const { applicationInfo, manageUsersApiClient, feComponentsClient } = dataAccess()

  const userService = new UserService(manageUsersApiClient)

  const feComponentsService = new FeComponentsService(feComponentsClient)

  return {
    applicationInfo,
    userService,
    feComponentsService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
