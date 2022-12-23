export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined | {
    id: string
    name?: string
  }
}

export interface SaveGoogleAccountRepository {
  saveWithGoogle: (params: SaveGoogleAccountRepository.Params) => Promise<SaveGoogleAccountRepository.Result>
}

export namespace SaveGoogleAccountRepository {
  export type Params = {
    id?: string
    name: string
    email: string
    googleId: string
  }

  export type Result = {
    id: string
  }
}
