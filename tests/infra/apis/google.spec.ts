import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

describe('GoogleApi', () => {
  let sut: GoogleApi
  let clientId: string
  let googleClient: GoogleClient
  let token: string
  beforeAll(() => {
    clientId = 'any_client_id'
    token = 'any_client_token'
    googleClient = mock<GoogleClient>()
  })

  beforeEach(() => {
    sut = new GoogleApi(googleClient, clientId)
  })

  it('should get google user by token', async () => {
    await sut.loadUser({ token: 'any_client_token' })
    expect(googleClient.verifyIdToken).toHaveBeenCalledWith({ token, clientId })
  })
})

interface GoogleClient {
  verifyIdToken: (params: GoogleClient.Input) => Promise<GoogleClient.Output>
}

namespace GoogleClient {
  export type Input = {
    token: string
    clientId: string
  }

  export type Output = {
    googleId: string
    email: string
    name: string
  }
}

export class GoogleApi {
  constructor (private readonly googleClient: GoogleClient, private readonly clientId: string) { }
  async loadUser (params: LoadGoogleUserApi.Input): Promise<GoogleClient.Output> {
    return await this.googleClient.verifyIdToken({ token: params.token, clientId: this.clientId })
  }
}
