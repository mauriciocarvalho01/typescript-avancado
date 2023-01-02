import { Controller } from '@/application/controllers'
import { Request, Response } from 'express'
export class ExpressRouter {
  constructor (private readonly controller: Controller) { }
  async adapter (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}
