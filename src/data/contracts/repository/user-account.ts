export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveGoogleAccountRepository {
  saveWithGoogle: (params: SaveGoogleAccountRepository.Input) => Promise<SaveGoogleAccountRepository.Output>
}

export namespace SaveGoogleAccountRepository {
  export type Input = {
    id?: string
    name: string
    email: string
    googleId: string
  }

  export type Output = {
    id: string
  }
}
