import { ProviderClient } from '@/infra/gateways'
import { LoadGoogleUserApi } from '@/data/contracts/gateways'

export class GoogleApi implements LoadGoogleUserApi {
  constructor (private readonly googleProviderClient: ProviderClient, private readonly clientId: string) { }
  async loadUser (params: LoadGoogleUserApi.Input): Promise<LoadGoogleUserApi.Output> {
    return await this.googleProviderClient.verifyIdToken({ token: params.token, clientId: this.clientId })
      .then(userInfo => (
        {
          googleId: userInfo.payload.sub,
          name: userInfo.payload.name,
          email: userInfo.payload.email
        }
      )).catch(() => undefined)
  }
}
