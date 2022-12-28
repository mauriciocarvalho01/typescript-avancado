import { GoogleApi, GoogleProviderClient } from '@/infra/gateways/google'
import { Environments } from '@/environments'

describe('GoogleApi', () => {
  const env = Environments.instance.getEnvironments()
  console.log(env)
  let token: string
  beforeAll(() => {
    token = env.googleClientToken
  })
  it('Should return a Google User if token is valid', async () => {
    const googleProviderClient = new GoogleProviderClient()
    const sut = new GoogleApi(googleProviderClient, env.googleClientId)
    const googleUser = await sut.loadUser({ token })
    expect(googleUser).toEqual({
      googleId: '115416733142652538327',
      email: 'developer.mauricio1@gmail.com',
      name: 'Mauricio Carvalho'
    })
  })
})
