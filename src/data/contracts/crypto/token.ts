export interface TokenGenarator {
  generateToken: (params: TokenGenarator.Params) => Promise<void>
}

export namespace TokenGenarator {
  export type Params = {
    key: string
  }
}
