// import { NextFunction, Request, RequestHandler, Response } from 'express'
// import { getMockReq, getMockRes } from '@jest-mock/express'
// import { Controller } from '@/application/controllers'
// import { mock, MockProxy } from 'jest-mock-extended'
// import { adapterExpressRoute } from '@/infra/http'

// describe('ExpressRouter', () => {
//   let req: Request
//   let res: Response
//   let next: NextFunction
//   let controller: MockProxy<Controller>
//   let sut: RequestHandler
//   beforeEach(() => {
//     req = getMockReq({ body: { data: 'any_data' } })
//     res = getMockRes().res
//     next = getMockRes().next
//     controller = mock()
//     controller.handle.mockResolvedValue({
//       statusCode: 200,
//       data: { data: 'any_data' }
//     })
//     sut = adapterExpressRoute(controller)
//   })
//   it('should call handle with correct request', async () => {
//     await sut(req, res, next)
//     expect(controller.handle).toHaveBeenCalledWith({ data: 'any_data' })
//     expect(controller.handle).toHaveBeenCalledTimes(1)
//   })

//   it('should call handle with empty request', async () => {
//     req = getMockReq({ body: undefined })
//     await sut(req, res, next)
//     expect(controller.handle).toHaveBeenCalledWith({})
//     expect(controller.handle).toHaveBeenCalledTimes(1)
//   })

//   it('should response with 200 and valid data', async () => {
//     await sut(req, res, next)
//     expect(res.status).toHaveBeenCalledWith(200)
//     expect(res.status).toHaveBeenCalledTimes(1)
//     expect(res.json).toHaveBeenCalledWith({ data: 'any_data' })
//     expect(res.json).toHaveBeenCalledTimes(1)
//   })

//   it('should response with 400 and valid error', async () => {
//     controller.handle.mockResolvedValueOnce({
//       statusCode: 400,
//       data: new Error('any_error')
//     })
//     await sut(req, res, next)
//     expect(res.status).toHaveBeenCalledWith(400)
//     expect(res.status).toHaveBeenCalledTimes(1)
//     expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
//     expect(res.json).toHaveBeenCalledTimes(1)
//   })

//   it('should response with 500 and valid error', async () => {
//     controller.handle.mockResolvedValueOnce({
//       statusCode: 500,
//       data: new Error('any_error')
//     })
//     await sut(req, res, next)
//     expect(res.status).toHaveBeenCalledWith(500)
//     expect(res.status).toHaveBeenCalledTimes(1)
//     expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
//     expect(res.json).toHaveBeenCalledTimes(1)
//   })
// })
