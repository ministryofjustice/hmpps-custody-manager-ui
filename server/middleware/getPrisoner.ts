import { RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonerSearchService'
import logger from '../../logger'

export default function getPrisoner(prisonerSearchService: PrisonerSearchService): RequestHandler {
  return async (req, res, next) => {
    const { user } = res.locals
    const { prisonerNumber } = req.params

    if (user && prisonerNumber) {
      try {
        req.prisoner = await prisonerSearchService.getByPrisonerNumber(res.locals.user.username, prisonerNumber)
      } catch (error) {
        logger.error(error, `Failed to get prisoner with prisoner number: ${prisonerNumber}`)
        return next(error)
      }
    }

    return next()
  }
}
