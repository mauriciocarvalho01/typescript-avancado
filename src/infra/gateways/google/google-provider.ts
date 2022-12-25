import { ProviderClient } from '@/infra/gateways'
import { OAuth2Client } from 'google-auth-library'

export class GoogleProviderClient implements ProviderClient {
  async verifyIdToken (params: ProviderClient.Input): Promise<any> {
    const client = new OAuth2Client(params.clientId)
    return await client.verifyIdToken({
      idToken: params.token,
      audience: params.clientId
    })
  }
}
