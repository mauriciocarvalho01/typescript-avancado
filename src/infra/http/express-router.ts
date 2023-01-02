import { Controller } from '@/application/controllers'
import { Request, RequestHandler, Response } from 'express'

// OOP
export class ExpressRouter {
  constructor (private readonly controller: Controller) { }
  async adapter (req: Request, res: Response): Promise<void> {
    const { statusCode, data } = await this.controller.handle({ ...req.body })
    const json = statusCode === 200 ? data : { error: data.message }
    res.status(statusCode).json(json)
  }
}

// FUNCTION
export const adapterExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({ ...req.body })
    const json = statusCode === 200 ? data : { error: data.message }
    res.status(statusCode).json(json)
  }
}
