import { GoogleClient } from '@/infra/apis'
import { LoadGoogleUserApi } from '@/data/contracts/apis'

export class GoogleApi {
  constructor (private readonly googleClient: GoogleClient, private readonly clientId: string) { }
  async loadUser (params: LoadGoogleUserApi.Input): Promise<LoadGoogleUserApi.Output> {
    return await this.googleClient.verifyIdToken({ token: params.token, clientId: this.clientId })
  }
}
