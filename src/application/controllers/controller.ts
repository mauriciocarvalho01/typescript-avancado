import { HttpHelper, HttpResponse, HttpRequest, SuccessResponse } from '@/application/helpers'
import { ValidationComposite, ValidationBuilder } from '@/application/validation'

type HttpResponseModel = Error | SuccessResponse

export abstract class Controller {
  httpHelper: HttpHelper = new HttpHelper()
  abstract perform (HttpRequest: any): Promise<HttpResponse<HttpResponseModel>>
  async handle (HttpRequest: any): Promise<HttpResponse<HttpResponseModel>> {
    try {
      const error = this.validate(HttpRequest)
      if (error !== undefined) return this.httpHelper.badRequest(error)
      await this.perform({ token: HttpRequest.token })
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
