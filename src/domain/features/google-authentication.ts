import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface GoogleAuthentication {
  perform: (params: GoogleAuthentication.Input) => Promise<GoogleAuthentication.Output>
}

export namespace GoogleAuthentication {
  export type Input = {
    token: string
  }

  export type Output = AccessToken | AuthenticationError
}
