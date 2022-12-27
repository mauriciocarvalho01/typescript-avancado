import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, MockProxy } from 'jest-mock-extended'
import { UnauthorizedError } from '@/application/errors'
import { GoogleLoginController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'

describe('GoogleLoginController', () => {
  let sut: GoogleLoginController
  let googleAuth: MockProxy<GoogleAuthentication>
  let token: string
  beforeAll(() => {
    googleAuth = mock()
    googleAuth.perform.mockResolvedValue(new AccessToken('any_value'))
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new GoogleLoginController(googleAuth)
  })

  it('Should build Validators correctly', async () => {
    const validators = await sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('Should call GoogleAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(googleAuth.perform).toHaveBeenCalledWith({ token })
    expect(googleAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('Should return 401 if authentication fails', async () => {
    googleAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual(
      {
        statusCode: 401,
        data: new UnauthorizedError()
      }
    )
  })

  it('Should return 200 if authentication return success', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual(
      {
        statusCode: 200,
        data: {
          accessToken: 'any_value'
        }
      }
    )
  })
})
