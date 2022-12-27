import { HttpHelper, HttpResponse } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'

export abstract class Controller {
  httpHelper: HttpHelper = new HttpHelper()
  abstract perform (HttpRequest: any): Promise<HttpResponse>

  buildValidators (HttpRequest: any): Validator[] {
    return []
  }

  async handle (HttpRequest: any): Promise<HttpResponse> {
    const error = this.validate(HttpRequest)
    if (error !== undefined) return this.httpHelper.badRequest(error)
    try {
      return await this.perform(HttpRequest)
    } catch (error) {
      return this.httpHelper.serverError(error as Error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
