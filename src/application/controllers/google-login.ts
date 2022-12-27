import { GoogleAuthentication } from '@/domain/features'
import { HttpHelper, httpResponse, httpRequest, SuccessResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { Validation } from '@/application/validation'

type HttpResponseModel = Error | SuccessResponse

export class GoogleLoginController {
  httpHelper: HttpHelper = new HttpHelper()
  validator: Validation = new Validation()
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: httpRequest): Promise<httpResponse<HttpResponseModel>> {
    try {
      const error = this.validator.validate(httpRequest)
      if (error !== undefined) return this.httpHelper.badRequest(error)
      const accessToken = await this.googleAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) return this.httpHelper.ok({ accessToken: accessToken.value })
      return this.httpHelper.unauthorized()
    } catch (error) {
      return this.httpHelper.serverError(error as Error)
    }
  }
}
