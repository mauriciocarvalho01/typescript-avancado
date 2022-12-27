import { GoogleAuthentication } from '@/domain/features'
import { HttpHelper, httpResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors/http'

type httpRequest = {
  token: string | undefined | null
}
type SuccessResponse = {
  accessToken: string
}

type HttpResponseModel = Error | SuccessResponse

export class GoogleLoginController {
  httpHelper: HttpHelper = new HttpHelper()
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: httpRequest): Promise<httpResponse<HttpResponseModel>> {
    try {
      if (httpRequest.token === '' || httpRequest.token === undefined || httpRequest.token === null) {
        return this.httpHelper.badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.googleAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) return this.httpHelper.ok({ accessToken: accessToken.value })
      return this.httpHelper.unauthorized()
    } catch (error) {
      return this.httpHelper.serverError(error as Error)
    }
  }
}
