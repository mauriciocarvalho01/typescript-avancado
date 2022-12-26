import { makeFakeDb, FakeDb } from '@/tests/infra/database/postgres/mocks'
import { PgUserAccountRepository } from '@/infra/database/postgres/repository'
import { PgUser } from '@/infra/database/postgres/entities'

import { Repository } from 'typeorm'
import { IBackup } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepository: Repository<PgUser>
  let backup: IBackup
  let fakeDb: FakeDb
  beforeAll(async () => {
    fakeDb = await makeFakeDb([PgUser])
    backup = fakeDb.db.backup()
    pgUserRepository = fakeDb.dataSource.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository(fakeDb.dataSource)
  })

  describe('load', () => {
    it('Should return account if email exists', async () => {
      await pgUserRepository.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('Should return account if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithGoogle', () => {
    it('Should create an account if id is undefined', async () => {
      await sut.saveWithGoogle({ email: 'any_email', name: 'any_name', googleId: 'any_google_id' })
      const pgUser = await pgUserRepository.findOne({ where: { email: 'any_email' } })
      expect(pgUser?.id).toBe(1)
    })

    it('Should update an account if id is defined', async () => {
      await pgUserRepository.save({ email: 'any_email', name: 'any_name', googleId: 'any_google_id' })

      await sut.saveWithGoogle({ id: '1', email: 'new_email', name: 'new_name', googleId: 'new_google_id' })

      const pgUser = await pgUserRepository.findOne({ where: { id: 1 } })

      expect(pgUser).toEqual({ id: 1, email: 'any_email', name: 'new_name', googleId: 'new_google_id' })
    })
  })
})
