import { GoogleAuthentication } from '@/domain/features'
import { mock } from 'jest-mock-extended'

describe('GoogleLoginController', () => {
  it('Should return 400 if token is empty ', async () => {
    const googleAuth = mock<GoogleAuthentication>()
    const sut = new GoogleLoginController(googleAuth)

    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should return 400 if token is null ', async () => {
    const googleAuth = mock<GoogleAuthentication>()
    const sut = new GoogleLoginController(googleAuth)

    const httpResponse = await sut.handle({ token: null })
    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should return 400 if token is undefined ', async () => {
    const googleAuth = mock<GoogleAuthentication>()
    const sut = new GoogleLoginController(googleAuth)

    const httpResponse = await sut.handle({ token: undefined })
    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should call GoogleAuthentication with correct params', async () => {
    const googleAuth = mock<GoogleAuthentication>()
    const sut = new GoogleLoginController(googleAuth)

    await sut.handle({ token: 'any_token' })

    expect(googleAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(googleAuth.perform).toHaveBeenCalledTimes(1)
  })
})

type httpResponse = {
  statusCode: number
  data: any
}

class GoogleLoginController {
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: any): Promise<httpResponse> {
    await this.googleAuth.perform({ token: httpRequest.token })
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}
