import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, CreateGoogleAccountRepository } from '@/data/contracts/repository'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateGoogleAccountRepository) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.googleApi.loadUser(params)
    if (googleData !== undefined) {
      await this.userAccountRepository.load({ email: googleData.email })
      await this.userAccountRepository.createFromGoogle(googleData)
    }
    return new AuthenticationError()
  }
}
