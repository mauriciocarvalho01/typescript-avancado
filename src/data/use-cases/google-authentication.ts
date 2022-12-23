import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, CreateGoogleAccountRepository, UpdateGoogleAccountRepository } from '@/data/contracts/repository'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateGoogleAccountRepository & UpdateGoogleAccountRepository) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.googleApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: googleData.email })
      if (accountData !== undefined) {
        await this.userAccountRepository.updateWithGoogle({
          id: accountData.id, name: accountData.name ?? googleData.name, googleId: googleData.googleId
        })
      } else {
        await this.userAccountRepository.createFromGoogle(googleData)
      }
    }
    return new AuthenticationError()
  }
}
