import { ProviderClient } from '@/infra/gateways'
import { LoadGoogleUserApi } from '@/data/contracts/gateways'

type Params = LoadGoogleUserApi.Input
type Result = LoadGoogleUserApi.Output

export class GoogleApi implements LoadGoogleUserApi {
  constructor (private readonly googleProviderClient: ProviderClient, private readonly clientId: string) { }
  async loadUser ({ token }: Params): Promise<Result> {
    return await this.googleProviderClient.verifyIdToken({ token, clientId: this.clientId })
      .then(({ payload }) => (
        {
          googleId: payload.sub,
          name: payload.name,
          email: payload.email
        }
      )).catch(() => undefined)
  }
}
