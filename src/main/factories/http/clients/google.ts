import { GoogleProviderClient } from '@/infra/gateways/google'

export const makeGoogleProviderClient = (): GoogleProviderClient => {
  return new GoogleProviderClient()
}
