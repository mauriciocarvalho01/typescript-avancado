import { PgUserAccountRepository } from '@/infra/database/postgres/repository'
import { PgConnection } from '@/infra/database/postgres/helpers'
import { PgUser } from '@/infra/database/postgres/entities'
import { makeConnection } from '@/tests/infra/database/postgres/mocks'

import { ObjectLiteral, Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepository: Repository<ObjectLiteral>
  let pgConnection: PgConnection
  let backup: IBackup

  beforeAll(async () => {
    pgConnection = PgConnection.instance
    await pgConnection.connect()
    const fakeDb = await makeConnection([PgUser])
    backup = fakeDb.db.backup()
    pgUserRepository = pgConnection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await pgConnection.disconnect()
  })

  describe('load', () => {
    it('Should return account if email exists', async () => {
      await pgUserRepository.save({ email: 'developer.mauricio1@gmail.com' })

      const account = await sut.load({ email: 'developer.mauricio1@gmail.com' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return account if email does not exists', async () => {
      const account = await sut.load({ email: 'error.email.mauricio1@gmail.com' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithGoogle', () => {
    it('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithGoogle({ email: 'developer.mauricio1@gmail.com', name: 'Mauricio Carvalho Pinheiro', googleId: 'any_google_id' })
      const pgUser = await pgUserRepository.findOne({ where: { email: 'developer.mauricio1@gmail.com' } })
      expect(pgUser?.id).toBe(1)
      expect(id).toBe('2')
    })

    it('Should update an account if id is defined', async () => {
      await pgUserRepository.save({ email: 'developer.mauricio1@outlook.com', name: 'Mauricio Carvalho Pinheiro', googleId: 'any_google_id' })

      const { id } = await sut.saveWithGoogle({ id: '1', email: 'developer.mauricio1@gmail.com', name: 'Mauricio C Pinheiro', googleId: 'new_google_id' })

      const pgUser = await pgUserRepository.findOne({ where: { id: 1 } })

      expect(pgUser).toEqual({ id: 1, email: 'developer.mauricio1@gmail.com', name: 'Mauricio C Pinheiro', googleId: 'new_google_id', initials: null, pictureUrl: null })
      expect(id).toBe('1')
    })
  })
})
