import { ProviderClient } from '@/infra/gateways'
import { OAuth2Client } from 'google-auth-library'

jest.mock('google-auth-library')

describe('GoogleProvider', () => {
  describe('User Account', () => {
    it('Should calls lib method with correct params', async () => {
      const client = new OAuth2Client('any_client_id')
      const fakeOAuth2Client = client as jest.Mocked<typeof client>
      const sut = new GoogleProviderClient()
      await sut.verifyIdToken({
        token: 'any_client_token',
        clientId: 'any_client_id'
      })
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledWith({ audience: 'any_client_id', idToken: 'any_client_token' })
    })
  })
})

export class GoogleProviderClient implements ProviderClient {
  async verifyIdToken (params: ProviderClient.Input): Promise<any> {
    const client = new OAuth2Client(params.clientId)
    await client.verifyIdToken({
      idToken: params.token,
      audience: params.clientId
    })
  }
}
