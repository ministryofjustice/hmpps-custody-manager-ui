import { Request, Response } from 'express'

export default class DocumentsRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisoner } = req

    res.render('pages/prisoner/documents', { prisoner })
  }
}
