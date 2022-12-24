import { GoogleClient } from '@/infra/apis'
import { LoadGoogleUserApi } from '@/data/contracts/apis'

export class GoogleApi {
  constructor (private readonly googleClient: GoogleClient, private readonly clientId: string) { }
  async loadUser (params: LoadGoogleUserApi.Input): Promise<GoogleClient.Output> {
    return await this.googleClient.verifyIdToken({ token: params.token, clientId: this.clientId })
  }
}
