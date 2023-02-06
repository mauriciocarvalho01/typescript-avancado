import { PgConnection } from '@/infra/database/postgres/helpers'

describe('PgConnection', () => {
  let pgConnection: PgConnection

  beforeEach(() => {
    pgConnection = PgConnection.instance
  })
  it('Should connection is connected', async () => {
    const logSpy = jest.spyOn(console, 'log')
    await pgConnection.connect()
    expect(logSpy).toHaveBeenCalledWith('Data Source has been initialized!')
  })

  it('Should connection is disconnected', async () => {
    const logSpy = jest.spyOn(console, 'log')
    await pgConnection.disconnect()
    expect(logSpy).toHaveBeenCalledWith('Data Source has been disconnected!')
  })
})
