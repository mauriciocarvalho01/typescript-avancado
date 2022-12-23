import { GoogleAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

class GoogleAuthenticationUseCase {
  constructor (private readonly loadGoogleUserApi: LoadGoogleUserApi) { }
  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    await this.loadGoogleUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

interface LoadGoogleUserApi {
  loadUser: (params: LoadGoogleUserApi.Params) => Promise<void>
}

namespace LoadGoogleUserApi {
  export type Params = {
    token: string
  }
  export type Result = undefined
}

class LoadGoogleUserApiSpy implements LoadGoogleUserApi {
  token?: string
  result = undefined
  async loadUser (params: LoadGoogleUserApi.Params): Promise<LoadGoogleUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('GoogleAuthenticationUseCase', () => {
  it('should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadGoogleUserApi.token).toBe('any_token')
  })

  it('should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    loadGoogleUserApi.result = undefined
    const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
