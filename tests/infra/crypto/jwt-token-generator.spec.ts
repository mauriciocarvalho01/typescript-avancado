import { TokenGenarator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

class JwtTokenGenerator {
  constructor (private readonly secret: string) { }
  async generateToken (params: TokenGenarator.Input): Promise<TokenGenarator.Output> {
    const expirationInSeconds = params.expirationInMs / 1000
    return jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let secret: string
  let key: string
  let expirationInMs: number
  let fakeJwt: jest.Mocked<typeof jwt>
  let mockToken: string
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    secret = 'any_secret'
    key = 'any_key'
    expirationInMs = 1000
    mockToken = 'any_token'
    fakeJwt.sign.mockImplementation(() => mockToken)
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(secret)
  })
  it('Should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
  })

  it('Should return generateToken a token', async () => {
    const token = await sut.generateToken({ key: 'any_key', expirationInMs })

    expect(token).toBe(mockToken)
  })

  it('Should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

    const promise = sut.generateToken({ key: 'any_key', expirationInMs })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
