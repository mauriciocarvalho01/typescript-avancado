import { Environments } from '@/environments'
import dotenv from 'dotenv'

jest.mock('dotenv')

describe('Environments', () => {
  let fakeDotenv: jest.Mocked<typeof dotenv>
  let sut: Environments
  beforeAll(() => {
    jest.restoreAllMocks()
    fakeDotenv = dotenv as jest.Mocked<typeof dotenv>
  })

  beforeEach(() => {
    sut = Environments.instance
  })

  it('Should dotenv call with correct params', () => {
    const env = sut.getEnvironments()

    expect(fakeDotenv.config).toHaveBeenCalledWith({ path: env.environmentPath })
  })

  it('Should getEnvironments returns data', () => {
    const env = sut.getEnvironments()

    expect(env.environment).toEqual('test')
  })

  it('Should Environments Singleton will have only one instantiation', () => {
    const logSpy = jest.spyOn(console, 'log')
    const sut1 = Environments.instance
    const sut2 = Environments.instance
    const sut3 = Environments.instance
    sut1.getEnvironments()
    sut2.getEnvironments()
    sut3.getEnvironments()
    expect(logSpy).toHaveBeenCalledWith('Call Count Environments: 1')
  })
})
