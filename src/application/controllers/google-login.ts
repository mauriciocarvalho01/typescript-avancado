import { GoogleAuthentication } from '@/domain/features'
import { HttpRequest, SuccessResponse, HttpResponse } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'

type HttpResponseModel = Error | SuccessResponse

export class GoogleLoginController extends Controller {
  constructor (private readonly googleAuth: GoogleAuthentication) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<HttpResponseModel>> {
    const accessToken = await this.googleAuth.perform({ token: httpRequest.token })
    if (accessToken instanceof AccessToken) return this.httpHelper.ok({ accessToken: accessToken.value })
    return this.httpHelper.unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]
  }
}
