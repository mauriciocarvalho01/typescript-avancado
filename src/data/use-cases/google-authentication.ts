import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repository'

export class GoogleAuthenticationUseCase {
  constructor (
    private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const googleData = await this.loadGoogleUserApi.loadUser(params)
    if (googleData !== undefined) {
      await this.loadUserAccountRepository.load({ email: googleData?.email })
    }
    return new AuthenticationError()
  }
}
