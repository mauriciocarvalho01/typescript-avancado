import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleLoginController', () => {
  let sut: GoogleLoginController
  let googleAuth: MockProxy<GoogleAuthentication>

  beforeAll(() => {
    googleAuth = mock()
  })

  beforeEach(() => {
    sut = new GoogleLoginController(googleAuth)
  })

  it('Should return 400 if token is empty ', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should return 400 if token is null ', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should return 400 if token is undefined ', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })

  it('Should call GoogleAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(googleAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(googleAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('Should return 400 if authentication fails', async () => {
    googleAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(
      {
        statusCode: 401,
        data: new AuthenticationError()
      }
    )
  })

  it('Should return 200 if authentication fails', async () => {
    googleAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(
      {
        statusCode: 401,
        data: new AuthenticationError()
      }
    )
  })
})

type httpResponse = {
  statusCode: number
  data: any
}

class GoogleLoginController {
  constructor (private readonly googleAuth: GoogleAuthentication) { }
  async handle (httpRequest: any): Promise<httpResponse> {
    if (httpRequest.token === '' || httpRequest.token === undefined || httpRequest.token === null) {
      return {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    }
    const result = await this.googleAuth.perform({ token: httpRequest.token })
    return {
      statusCode: 401,
      data: result
    }
  }
}
