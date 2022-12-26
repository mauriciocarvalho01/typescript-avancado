import { GoogleAuthentication } from '@/domain/features'
import { badRequest, httpResponse, serverError, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors/http'

export class GoogleLoginController {
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: any): Promise<httpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === undefined || httpRequest.token === null) {
        return badRequest(new RequiredFieldError('token'))
      }
      const accessToken = await this.googleAuth.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: accessToken.value }
        }
      }
      return unauthorized()
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
