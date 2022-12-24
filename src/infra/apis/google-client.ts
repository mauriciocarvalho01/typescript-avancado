export interface GoogleClient {
  verifyIdToken: <T = any> (params: GoogleClient.Input) => Promise<T>
}

export namespace GoogleClient {
  export type Input = {
    token: string
    clientId: string
  }
}
