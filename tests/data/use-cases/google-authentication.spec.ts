import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadUserAccountRepository, CreateGoogleAccountRepository, UpdateGoogleAccountRepository } from '@/data/contracts/repository'

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
  let googleApi: MockProxy<LoadGoogleUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & CreateGoogleAccountRepository & UpdateGoogleAccountRepository>
  let sut: GoogleAuthenticationUseCase
  const token = 'any_token'
  beforeEach(() => {
    googleApi = mock()
    googleApi.loadUser.mockResolvedValue({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    sut = new GoogleAuthenticationUseCase(googleApi, userAccountRepository)
  })

  it('Should call LoadGoogleUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(googleApi.loadUser).toHaveBeenCalledWith({ token })
    expect(googleApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    googleApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepository when LoadGoogleUserApi return data', async () => {
    await sut.perform({ token })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_google_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateGoogleAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    await sut.perform({ token })
    expect(userAccountRepository.createFromGoogle).toHaveBeenCalledWith({
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
    expect(userAccountRepository.createFromGoogle).toHaveBeenCalledTimes(1)
  })

  it('Should call UpdateGoogleAccountRepository when LoadUserAccountRepository returns data', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token })
    expect(userAccountRepository.updateWithGoogle).toHaveBeenCalledWith({
      name: 'any_name',
      id: 'any_id',
      googleId: 'any_google_id'
    })
    expect(userAccountRepository.updateWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('Should update account name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    })
    await sut.perform({ token })
    expect(userAccountRepository.updateWithGoogle).toHaveBeenCalledWith({
      name: 'any_google_name',
      id: 'any_id',
      googleId: 'any_google_id'
    })
    expect(userAccountRepository.updateWithGoogle).toHaveBeenCalledTimes(1)
  })
})
