import { LoadGoogleUserApi } from '@/data/contracts/gateways'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { AccessToken, GoogleAccount } from '@/domain/models'
import { TokenGenarator } from '@/data/contracts/crypto'

export class GoogleAuthenticationUseCase implements GoogleAuthentication {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveGoogleAccountRepository,
    private readonly crypto: TokenGenarator) { }

  async perform (params: GoogleAuthentication.Input): Promise<GoogleAuthentication.Output> {
    const googleData = await this.googleApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: googleData.email })
      const googleAccount = new GoogleAccount(googleData, accountData)
      const { id } = await this.userAccountRepository.saveWithGoogle(googleAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
