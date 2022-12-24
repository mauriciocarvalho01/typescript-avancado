import { LoadGoogleUserApi } from '@/data/contracts/apis'

export interface GoogleClient {
  verifyIdToken: (params: GoogleClient.Input) => Promise<LoadGoogleUserApi.Output>
}

export namespace GoogleClient {
  export type Input = {
    token: string
    clientId: string
  }
}
