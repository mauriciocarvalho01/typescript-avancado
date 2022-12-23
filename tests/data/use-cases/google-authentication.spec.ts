import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { TokenGenarator } from '@/data/contracts/crypto'
import { AccessToken, GoogleAccount } from '@/domain/models'

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
  let crypto: MockProxy<TokenGenarator>
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
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
    userAccountRepository.load.mockResolvedValue(undefined)
    userAccountRepository.saveWithGoogle.mockResolvedValue({ id: 'any_account_id' })
    sut = new GoogleAuthenticationUseCase(googleApi, userAccountRepository, crypto)
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

  it('Should call TokenGenerator with corret params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('Should returns an  AccessToken on success', async () => {
    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('Should rethrow if LoadGoogleUserApi throws', async () => {
    googleApi.loadUser.mockRejectedValueOnce(new Error('google_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('google_error'))
  })

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('account_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('account_error'))
  })

  it('Should rethrow if SaveGoogleAccountRepository throws', async () => {
    userAccountRepository.saveWithGoogle.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
