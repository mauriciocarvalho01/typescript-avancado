import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { ServerError, RequiredFieldError } from '@/application/errors'
import { GoogleLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors/http'

describe('GoogleLoginController', () => {
  let sut: GoogleLoginController
  let googleAuth: MockProxy<GoogleAuthentication>

  beforeAll(() => {
    googleAuth = mock()
    googleAuth.perform.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new GoogleLoginController(googleAuth)
  })

  it('Should return 400 if token is empty ', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new RequiredFieldError('token')
      })
  })

  it('Should return 400 if token is null ', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new RequiredFieldError('token')
      }
    )
  })

  it('Should return 400 if token is undefined ', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new RequiredFieldError('token')
      }
    )
  })

  it('Should call GoogleAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(googleAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(googleAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if authentication fails', async () => {
    googleAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(
      {
        statusCode: 401,
        data: new UnauthorizedError()
      }
    )
  })

  it('Should return 200 if authentication return success', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(
      {
        statusCode: 200,
        data: {
          accessToken: 'any_value'
        }
      }
    )
  })

  it('Should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    googleAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual(
      {
        statusCode: 500,
        data: new ServerError(error)
      }
    )
  })
})
