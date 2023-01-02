import { ProviderClient } from '@/infra/gateways'
import { OAuth2Client } from 'google-auth-library'

type Params = ProviderClient.Input

export class GoogleProviderClient implements ProviderClient {
  async verifyIdToken ({ clientId, token }: Params): Promise<any> {
    const client = new OAuth2Client(clientId)
    return await client.verifyIdToken({
      idToken: token,
      audience: clientId
    })
  }
}
