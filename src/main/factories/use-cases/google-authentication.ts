import { GoogleAuthenticationUseCase } from '@/data/use-cases'
import { makeGoogleApi } from '@/main/factories/apis'
import { makePgUserAccountRepository } from '@/main/factories/repository/postgress'
import { makeJwtTokenGenerator } from '@/main/factories/crypto/jwt-token-generator'

export const makeGoogleAuthenticationUseCase = (): GoogleAuthenticationUseCase => {
  return new GoogleAuthenticationUseCase(
    makeGoogleApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator()
  )
}
