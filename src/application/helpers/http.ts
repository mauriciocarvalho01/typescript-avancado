import { ServerError, UnauthorizedError } from '@/application/errors'

export type HttpRequest = {
  token: string
}
export type SuccessResponse = {
  accessToken: string
}

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export class HttpHelper {
  ok = <T = any>(data: T): HttpResponse<T> => ({
    statusCode: 200,
    data
  })

  badRequest = (error: Error): HttpResponse<Error> => ({
    statusCode: 400,
    data: error
  })

  unauthorized = (): HttpResponse<Error> => ({
    statusCode: 401,
    data: new UnauthorizedError()
  })

  serverError = (error: Error): HttpResponse<Error> => ({
    statusCode: 500,
    data: new ServerError(error)
  })
}
