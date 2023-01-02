import { TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

type Params = TokenGenerator.Input
type Result = TokenGenerator.Output

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) { }
  async generateToken ({ expirationInMs, key }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    return jwt.sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
