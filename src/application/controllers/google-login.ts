import { GoogleAuthentication } from '@/domain/features'
import { HttpHelper, httpResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredStringValidator, ValidationComposite } from '@/application/validation'

type httpRequest = {
  token: string
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
      const error = this.validate(httpRequest)
      if (error !== undefined) return this.httpHelper.badRequest(error)
      const accessToken = await this.googleAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) return this.httpHelper.ok({ accessToken: accessToken.value })
      return this.httpHelper.unauthorized()
    } catch (error) {
      return this.httpHelper.serverError(error as Error)
    }
  }

  private validate (httpRequest: httpRequest): Error | undefined {
    return new ValidationComposite([
      new RequiredStringValidator(httpRequest.token, 'token')
    ]).validate()
  }
}
