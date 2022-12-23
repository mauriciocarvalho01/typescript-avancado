import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadUserAccountRepository, CreateGoogleAccountRepository } from '@/data/contracts/repository'

// Factory Patthern
// type SuTypes = {
//   sut: GoogleAuthenticationUseCase
//   loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
// }

// const makeSut = (): SuTypes => {
//   const loadGoogleUserApi = mock<LoadGoogleUserApi>()
//   const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
//   return {
//     sut, loadGoogleUserApi
//   }
// }

describe('GoogleAuthenticationUseCase', () => {
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createGoogleAccountRepository: MockProxy<CreateGoogleAccountRepository>
  let sut: GoogleAuthenticationUseCase
  const token = 'any_token'
  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
    loadUserAccountRepository = mock()
    createGoogleAccountRepository = mock()
    sut = new GoogleAuthenticationUseCase(loadGoogleUserApi, loadUserAccountRepository, createGoogleAccountRepository)
  })

  it('Should call LoadGoogleUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepository when LoadGoogleUserApi return data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_google_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateGoogleAccountRepository when LoadGoogleUserApi return undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })
    expect(createGoogleAccountRepository.createFromGoogle).toHaveBeenCalledWith({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
    expect(createGoogleAccountRepository.createFromGoogle).toHaveBeenCalledTimes(1)
  })
})
