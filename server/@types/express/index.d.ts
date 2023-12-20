import type { UserDetails } from '../../services/userService'
import { Prisoner } from '../prisonerSearchApi/types'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User extends Partial<UserDetails> {
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
      prisoner?: Prisoner
    }

    interface Locals {
      user: Express.User
    }
  }
}
