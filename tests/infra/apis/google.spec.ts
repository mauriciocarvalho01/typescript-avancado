import { GoogleApi, GoogleClient } from '@/infra/apis'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleApi', () => {
  let sut: GoogleApi
  let clientId: string
  let googleClient: MockProxy<GoogleClient>
  let token: string
  beforeAll(() => {
    clientId = 'any_client_id'
    token = 'any_client_token'
    googleClient = mock()
  })

  beforeEach(() => {
    sut = new GoogleApi(googleClient, clientId)
  })

  it('should get google user by token', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(googleClient.verifyIdToken).toHaveBeenCalledWith({ token, clientId })
  })
})
