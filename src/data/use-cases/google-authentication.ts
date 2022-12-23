import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveGoogleAccountRepository) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.googleApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: googleData.email })
      await this.userAccountRepository.saveWithGoogle({
        id: accountData?.id,
        name: accountData?.name ?? googleData.name,
        email: googleData.email,
        googleId: googleData.googleId
      })
    }
    return new AuthenticationError()
  }
}
