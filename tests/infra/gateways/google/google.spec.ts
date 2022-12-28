import { LoadGoogleUserApi } from '@/data/contracts/gateways'
import { GoogleApi } from '@/infra/gateways/google'
import { ProviderClient } from '@/infra/gateways'
import { Environments } from '@/main/config/environments'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleApi', () => {
  const env = Environments.instance.getEnvironments()
  let sut: GoogleApi
  let clientId: string
  let googleClient: MockProxy<ProviderClient>
  let token: string
  let mockGoogleUser: LoadGoogleUserApi.Payload
  beforeAll(() => {
    clientId = env.googleClientId
    token = env.googleClientToken
    googleClient = mock()
    mockGoogleUser = {
      payload: {
        sub: '115416733142652538327',
        email: 'developer.mauricio1@gmail.com',
        name: 'Mauricio Carvalho'
      }
    }
  })

  beforeEach(() => {
    googleClient.verifyIdToken.mockResolvedValueOnce(mockGoogleUser)
    sut = new GoogleApi(googleClient, clientId)
  })

  it('should get google user by token', async () => {
    await sut.loadUser({ token })
    expect(googleClient.verifyIdToken).toHaveBeenCalledWith({ token, clientId })
    expect(googleClient.verifyIdToken).toHaveBeenCalledTimes(1)
  })

  it('should return google user', async () => {
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toEqual({
      googleId: '115416733142652538327',
      email: 'developer.mauricio1@gmail.com',
      name: 'Mauricio Carvalho'
    })
  })

  it('Should rethrow if GoogleClient throws', async () => {
    googleClient.verifyIdToken.mockReset().mockImplementationOnce(() => { throw new Error('Client Error') })
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toBeUndefined()
    expect(googleClient.verifyIdToken).toHaveBeenCalledTimes(1)
  })
})
