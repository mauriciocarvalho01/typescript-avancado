import { LoadGoogleUserApi } from '@/data/contracts/gateways'
import { GoogleApi } from '@/infra/gateways/google'
import { ProviderClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleApi', () => {
  let sut: GoogleApi
  let clientId: string
  let googleClient: MockProxy<ProviderClient>
  let token: string
  let mockGoogleUser: LoadGoogleUserApi.Payload
  beforeAll(() => {
    clientId = env.googleApi.clientId
    token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjAyYTYxZWZkMmE0NGZjMjE1MTQ4ZDRlZmZjMzRkNmE3YjJhYzI2ZjAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzIyMjQ5MTgsImF1ZCI6IjUzOTM1MTQzODk5MS1ka2dlYjh2Yjh0NzQ5ZnQyMnZvbm1qcWh2NDlwYmhmdS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNTQxNjczMzE0MjY1MjUzODMyNyIsImVtYWlsIjoiZGV2ZWxvcGVyLm1hdXJpY2lvMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXpwIjoiNTM5MzUxNDM4OTkxLWRrZ2ViOHZiOHQ3NDlmdDIydm9ubWpxaHY0OXBiaGZ1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwibmFtZSI6Ik1hdXJpY2lvIENhcnZhbGhvIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FFZEZUcDZqTTdRa2Q2bXZyblB4STd1ZllQVEpIRXVvSk9RcVBrTmN0bE1DPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1hdXJpY2lvIiwiZmFtaWx5X25hbWUiOiJDYXJ2YWxobyIsImlhdCI6MTY3MjIyNTIxOCwiZXhwIjoxNjcyMjI4ODE4LCJqdGkiOiI4MDQ5MGNiMzI4YjU3ZjlkM2YyYzQ0YTExMTRkOTdiMWRiZjAyMjQ4In0.S_O2Rvd_StXzXJgoXTeoQXP9ZFvKPJob_UyqQBkzgnYlOc1XCH__cE0SrsDvVflb-ORahSdbOqQjgYkk-cl0MmQ2vA2rbQRz_jLsC8CLP7CD07KFavVrOKOsl-NX350YS1mflpstO-ZlPHodOoT4o1DjcUVurK23xglzKY-MaIZi6q3ym4x5imc3BS_zsHorts-6N-s_oMjuXfAaiJI_ez2T2n9jDSCL3NUo7Qz9TwNc2zayB9tSrhQl6i9IbWGBLd5b5O2TWINx08buT8kNLLSCngEMGIv2-EUHZBlCvpqvLO6ePEv6Q4GZdS3VY1cwZ4sb_Z8PXcJmHI2t0eZj4g'
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
})
