import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleApi, ProviderClient } from '@/infra/gateways'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleApi', () => {
  let sut: GoogleApi
  let clientId: string
  let googleClient: MockProxy<ProviderClient>
  let token: string
  let mockGoogleUser: LoadGoogleUserApi.Output
  beforeAll(() => {
    clientId = 'any_client_id'
    token = 'any_client_token'
    googleClient = mock()
    mockGoogleUser = { googleId: 'any_google_id', name: 'any_google_name', email: 'any_google_email' }
  })

  beforeEach(() => {
    googleClient.verifyIdToken.mockResolvedValueOnce(mockGoogleUser)
    sut = new GoogleApi(googleClient, clientId)
  })

  it('should get google user by token', async () => {
    await sut.loadUser({ token })
    expect(googleClient.verifyIdToken).toHaveBeenCalledWith({ token, clientId })
  })

  it('should return google user', async () => {
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toEqual(mockGoogleUser)
  })
})