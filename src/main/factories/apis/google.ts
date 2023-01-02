import { GoogleApi } from '@/infra/gateways/google'
import { Environments } from '@/main/config/environments'
import { makeGoogleProviderClient } from '@/main/factories/http/clients/google'

export const makeGoogleApi = (): GoogleApi => {
  const env = Environments.instance.getEnvironments()
  return new GoogleApi(makeGoogleProviderClient(), env.clientId)
}
