import { RequestHandler } from 'express'
import PrisonerSearchService from '../services/prisonerSearchService'
import logger from '../../logger'
import FullPageError from '../model/FullPageError'

export default function getPrisoner(prisonerSearchService: PrisonerSearchService): RequestHandler {
  return async (req, res, next) => {
    const { user } = res.locals
    const { prisonerNumber } = req.params

    if (user && prisonerNumber) {
      try {
        const prisoner = await prisonerSearchService.getByPrisonerNumber(res.locals.user.username, prisonerNumber)
        req.prisoner = prisoner
        if (!user.caseloads.includes(prisoner.prisonId)) {
          throw FullPageError.notInCaseLoadError()
        }
        if (prisoner.prisonId === 'OUT') {
          throw FullPageError.prisonerOutError()
        }
      } catch (error) {
        logger.error(error, `Failed to get prisoner with prisoner number: ${prisonerNumber}`)
        return next(error)
      }
    }

    return next()
  }
}
