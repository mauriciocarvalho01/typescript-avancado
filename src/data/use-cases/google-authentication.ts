import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, CreateGoogleAccountRepository } from '@/data/contracts/repository'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createGoogleAccountRepository: CreateGoogleAccountRepository) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      await this.loadUserAccountRepository.load({ email: googleData.email })
      await this.createGoogleAccountRepository.createFromGoogle(googleData)
    }
    return new AuthenticationError()
  }
}
