import { TokenGenarator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (private readonly secret: string) { }
  async generateToken (params: TokenGenarator.Input): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let secret: string
  let key: string
  let expirationInMs: number
  let fakeJwt: jest.Mocked<typeof jwt>
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    secret = 'any_secret'
    key = 'any_key'
    expirationInMs = 1000
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret)
  })
  it('Should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
  })
})
