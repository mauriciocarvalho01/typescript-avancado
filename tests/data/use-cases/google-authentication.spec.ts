import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

describe('GoogleAuthenticationUseCase', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
