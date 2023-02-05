import { GoogleApi, GoogleProviderClient } from '@/infra/gateways/google'
import { Environments } from '@/environments'

describe('GoogleApi', () => {
  let env: any
  let token: string
  let googleProviderClient: GoogleProviderClient
  let sut: GoogleApi
  beforeAll(() => {
    jest.clearAllMocks()
    env = Environments.instance.getEnvironments()
    token = env.googleClientToken
    googleProviderClient = new GoogleProviderClient()
    sut = new GoogleApi(googleProviderClient, env.googleClientId)
  })
  it('Should return a Google User if token is valid', async () => {
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toEqual({
      googleId: '115416733142652538327',
      email: 'developer.mauricio1@gmail.com',
      name: 'Mauricio Carvalho'
    })
  })

  it('Should return undefined User if token is invalid', async () => {
    token = 'any_invalid_token'
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toBeUndefined()
  })
})
