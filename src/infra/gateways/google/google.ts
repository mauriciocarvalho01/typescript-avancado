import { ProviderClient } from '@/infra/gateways'
import { LoadGoogleUserApi } from '@/data/contracts/gateways'

export class GoogleApi implements LoadGoogleUserApi {
  constructor (private readonly googleClient: ProviderClient, private readonly clientId: string) { }
  async loadUser (params: LoadGoogleUserApi.Input): Promise<LoadGoogleUserApi.Output> {
    try {
      const { payload } = await this.googleClient.verifyIdToken({ token: params.token, clientId: this.clientId })
      if (payload !== undefined) {
        return {
          googleId: payload.sub,
          name: payload.name,
          email: payload.email
        }
      }
    } catch (error) {
      return undefined
    }
  }
}
