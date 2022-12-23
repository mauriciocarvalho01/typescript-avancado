import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { GoogleAccount } from '@/domain/models'
import { TokenGenarator } from '@/data/contracts/crypto'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveGoogleAccountRepository,
    private readonly crypto: TokenGenarator) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.googleApi.loadUser(params)
    if (googleData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: googleData.email })
      const googleAccount = new GoogleAccount(googleData, accountData)
      const { id } = await this.userAccountRepository.saveWithGoogle(googleAccount)
      await this.crypto.generateToken({ key: id })
    }
    return new AuthenticationError()
  }
}
