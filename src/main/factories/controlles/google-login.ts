import { GoogleLoginController } from '@/application/controllers'
import { makeGoogleAuthenticationUseCase } from '@/main/factories/use-cases/google-authentication'

export const makeGoogleLoginController = (): GoogleLoginController => {
  return new GoogleLoginController(makeGoogleAuthenticationUseCase())
}
