export interface TokenGenarator {
  generateToken: (params: TokenGenarator.Params) => Promise<TokenGenarator.Result>
}

export namespace TokenGenarator {
  export type Params = {
    key: string
    expirationInMs: number
  }

  export type Result = string
}
