import { GoogleAuthentication } from '@/domain/features'
import { HttpHelper, HttpRequest, SuccessResponse, HttpResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ValidationComposite, ValidationBuilder } from '@/application/validation'

type HttpResponseModel = Error | SuccessResponse

export class GoogleLoginController {
  httpHelper: HttpHelper = new HttpHelper()
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse<HttpResponseModel>> {
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

  private validate (httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite([
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]).validate()
  }
}
