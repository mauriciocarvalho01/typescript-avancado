// import { AuthenticationError } from '@/domain/errors'
// import { LoadGoogleUserApi } from '@/data/contracts/apis'
// import { GoogleAuthenticationUseCase } from '@/data/use-cases/google-authentication'

// class LoadGoogleUserApiSpy implements LoadGoogleUserApi {
//   token?: string
//   result = undefined
//   callsCount = 0
//   async loadUser (params: LoadGoogleUserApi.Params): Promise<LoadGoogleUserApi.Result> {
//     this.token = params.token
//     this.callsCount++
//     return this.result
//   }
// }

// describe('GoogleAuthenticationUseCase', () => {
//   it('Should call LoadGoogleUserApi with correct params', async () => {
//     const loadGoogleUserApi = new LoadGoogleUserApiSpy()
//     const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
//     await sut.perform({ token: 'any_token' })
//     expect(loadGoogleUserApi.token).toBe('any_token')
//     expect(loadGoogleUserApi.callsCount).toBe(1)
//   })

//   it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
//     const loadGoogleUserApi = new LoadGoogleUserApiSpy()
//     loadGoogleUserApi.result = undefined
//     const sut = new GoogleAuthenticationUseCase(loadGoogleUserApi)
//     const authResult = await sut.perform({ token: 'any_token' })
//     expect(authResult).toEqual(new AuthenticationError())
//   })
// })
