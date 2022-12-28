export interface LoadGoogleUserApi {
  loadUser: (params: LoadGoogleUserApi.Input) => Promise<LoadGoogleUserApi.Output>
}

export namespace LoadGoogleUserApi {
  export type Input = {
    token: string
  }
  export type Output = undefined | {
    googleId: string
    name: string
    email: string
  }
  export type Payload = {
    payload: {
      sub: string
      name: string
      email: string
    }
  }
}
