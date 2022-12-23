import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { GoogleAccount } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'

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

jest.mock('@/domain/models/google-account')

describe('GoogleAuthenticationUseCase', () => {
  let googleApi: MockProxy<LoadGoogleUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveGoogleAccountRepository>
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

  it('Should call LoadUserAccountRepository when LoadGoogleUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_google_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveGoogleAccountRepository with GoogleAccount', async () => {
    const googleAccountStub = jest.fn().mockImplementation(() => {
      return {
        any: 'any'
      }
    })

    jest.mocked(GoogleAccount).mockImplementation(googleAccountStub)

    await sut.perform({ token })

    expect(userAccountRepository.saveWithGoogle).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepository.saveWithGoogle).toHaveBeenCalledTimes(1)
  })
})
