export interface GoogleClient {
  verifyIdToken: (params: GoogleClient.Input) => Promise<GoogleClient.Output>
}

export namespace GoogleClient {
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
