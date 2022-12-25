export interface ProviderClient {
  verifyIdToken: <T = any> (params: ProviderClient.Input) => Promise<T>
}

export namespace ProviderClient {
  export type Input = {
    token: string
    clientId: string
  }
}
