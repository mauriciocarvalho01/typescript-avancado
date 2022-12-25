import { ProviderClient } from '@/infra/gateways'
import { OAuth2Client } from 'google-auth-library'

jest.mock('google-auth-library')

describe('GoogleProvider', () => {
  let sut: GoogleProviderClient
  let client: OAuth2Client
  let fakeOAuth2Client: jest.Mocked<typeof client>
  let clientId: string
  let token: string
  beforeAll(() => {
    client = new OAuth2Client(clientId)
    fakeOAuth2Client = client as jest.Mocked<typeof client>
    clientId = 'any_client_id'
    token = 'any_client_token'
  })
  beforeEach(() => {
    sut = new GoogleProviderClient()
  })
  describe('User Account', () => {
    it('Should calls lib method with correct params', async () => {
      await sut.verifyIdToken({ token, clientId })
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledWith({ audience: clientId, idToken: token })
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledTimes(1)
    })

    it('Should calls lib method with correct params', async () => {
      await sut.verifyIdToken({ token, clientId })
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledWith({ audience: clientId, idToken: token })
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledTimes(1)
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
