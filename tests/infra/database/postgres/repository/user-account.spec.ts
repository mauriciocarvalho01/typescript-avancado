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

    it('saveWithFacebook', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })
})
