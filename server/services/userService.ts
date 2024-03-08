import { jwtDecode } from 'jwt-decode'
import { convertToTitleCase } from '../utils/utils'
import type { User } from '../data/manageUsersApiClient'
import ManageUsersApiClient from '../data/manageUsersApiClient'

export interface UserDetails extends User {
  displayName: string
  roles: string[]
  hasAdjustmentsAccess: boolean
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    const roles = this.getUserRoles(token)
    return {
      ...user,
      roles,
      displayName: convertToTitleCase(user.name),
      hasAdjustmentsAccess: this.hasAdjustmentsAccess(roles),
    }
  }

  getUserRoles(token: string): string[] {
    const { authorities: roles = [] } = jwtDecode(token) as { authorities?: string[] }
    return roles.map(role => role.substring(role.indexOf('_') + 1))
  }

  hasAdjustmentsAccess(roles: string[]): boolean {
    return roles.includes('ADJUSTMENTS_MAINTAINER')
  }
}
