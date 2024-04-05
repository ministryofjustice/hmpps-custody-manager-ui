import { RequestHandler } from 'express'

export default function setupFullPath(): RequestHandler {
  return async (req, res, next) => {
    const { path } = req.route
    res.locals.unparsedPath = `${req.baseUrl}${path}`
    return next()
  }
}
