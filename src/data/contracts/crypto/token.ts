export interface TokenGenarator {
  generateToken: (params: TokenGenarator.Input) => Promise<TokenGenarator.Output>
}

export namespace TokenGenarator {
  export type Input = {
    key: string
    expirationInMs: number
  }

  export type Output = string
}
