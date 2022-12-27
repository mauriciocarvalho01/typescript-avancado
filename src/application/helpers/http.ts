import { ServerError, UnauthorizedError } from '@/application/errors'

export type httpResponse<T = any> = {
  statusCode: number
  data: T
}

export class HttpHelper {
  ok = <T = any>(data: T): httpResponse<T> => ({
    statusCode: 200,
    data
  })

  badRequest = (error: Error): httpResponse<Error> => ({
    statusCode: 400,
    data: error
  })

  unauthorized = (): httpResponse<Error> => ({
    statusCode: 401,
    data: new UnauthorizedError()
  })

  serverError = (error: Error): httpResponse<Error> => ({
    statusCode: 500,
    data: new ServerError(error)
  })
}
