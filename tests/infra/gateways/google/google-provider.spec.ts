import { GoogleProviderClient } from '@/infra/gateways/google'
import { OAuth2Client } from 'google-auth-library'

jest.mock('google-auth-library')

describe('GoogleProvider', () => {
  let sut: GoogleProviderClient
  let client: OAuth2Client
  let fakeOAuth2Client: jest.Mocked<typeof client>
  let clientId: string
  let token: string
  let email: string
  beforeAll(() => {
    client = new OAuth2Client(clientId)
    fakeOAuth2Client = client as jest.Mocked<typeof client>
    clientId = 'any_client_id'
    token = 'any_client_token'
    email = 'any_client_email'
    fakeOAuth2Client.verifyIdToken.mockResolvedValue(email as never)
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

    it('Should return data on success', async () => {
      const result = await sut.verifyIdToken({ token, clientId })
      expect(result).toEqual(email)
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledTimes(1)
    })

    it('Should rethrow if verifyIdToken throws', async () => {
      fakeOAuth2Client.verifyIdToken.mockRejectedValueOnce(new Error('OAuth2Client Error') as never)
      const promise = sut.verifyIdToken({ token, clientId })
      await expect(promise).rejects.toThrow(new Error('OAuth2Client Error') as never)
      expect(fakeOAuth2Client.verifyIdToken).toHaveBeenCalledTimes(1)
    })
  })
})
