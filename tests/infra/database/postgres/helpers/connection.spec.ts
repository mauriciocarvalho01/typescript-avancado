import { DatasourceNotFoundError, PgConnection } from '@/infra/database/postgres/helpers'
import { DataSource } from 'typeorm'
import { PgUser } from '@/infra/database/postgres/entities'
import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  DataSource: jest.fn().mockImplementation(() => ({
    getRepository: jest.fn(),
    initialize: jest.fn(),
    destroy: jest.fn()
  }))
}))

describe('PgConnection', () => {
  let getRepositorySpy: jest.Mock
  let sut: PgConnection
  let datasource: MockProxy<DataSource>
  beforeAll(() => {
    getRepositorySpy = jest.fn().mockReturnValue('any_repo')
    datasource = mock()
    datasource.getRepository.mockImplementation(getRepositorySpy)
  })

  beforeEach(() => {
    sut = PgConnection.instance
  })

  it('should have only one instance', () => {
    const sut2 = PgConnection.instance

    expect(sut).toBe(sut2)
  })

  it('Should connection is connected', async () => {
    const logSpy = jest.spyOn(console, 'log')
    await sut.connect()
    expect(logSpy).toHaveBeenCalledWith('Data Source has been initialized!')
  })

  it('Should connection not connected', async () => {
    const logSpy = jest.spyOn(console, 'log')
    await sut.connect()
    expect(logSpy).toHaveBeenCalledWith('Data Source has been initialized!')
  })

  it('should return ConnectionNotFoundError on connect if connection is not found', async () => {
    try {
      datasource.initialize.mockImplementation(() => {
        throw new DatasourceNotFoundError()
      })
      await sut.connect()
    } catch (error) {
      expect(datasource.initialize).not.toHaveBeenCalled()
      expect(error).toThrow(new DatasourceNotFoundError())
    }
  })

  it('should return ConnectionNotFoundError on getRepository if connection is not found', async () => {
    datasource.getRepository.mockImplementation(() => {
      throw new DatasourceNotFoundError()
    })
    try {
      sut.getRepository(PgUser)
    } catch (error) {
      expect(getRepositorySpy).not.toHaveBeenCalled()
      expect(error).toThrow(new DatasourceNotFoundError())
    }
  })
})
