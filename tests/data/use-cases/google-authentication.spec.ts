import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'

describe('GoogleAuthenticationUseCase', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = {
      loadUser: jest.fn()
    }
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = {
      loadUser: jest.fn()
    }
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
