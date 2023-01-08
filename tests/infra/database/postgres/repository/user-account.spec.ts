import { PgUserAccountRepository } from '@/infra/database/postgres/repository'
import { PgConnection } from '@/infra/database/postgres/helpers'
import { PgUser } from '@/infra/database/postgres/entities'

import { ObjectLiteral, Repository } from 'typeorm'


describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepository: Repository<ObjectLiteral>
  let pgConnection: PgConnection
  beforeAll(async () => {
    pgConnection = PgConnection.instance
    await pgConnection.connect()
    pgUserRepository = pgConnection.getRepository(PgUser)
  })

  beforeEach(() => {
    sut = new PgUserAccountRepository()
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
      const { id } = await sut.saveWithGoogle({ email: 'any_email', name: 'any_name', googleId: 'any_google_id' })
      const pgUser = await pgUserRepository.findOne({ where: { email: 'any_email' } })
      expect(pgUser?.id).toBe(1)
      expect(id).toBe('1')
    })

    it('Should update an account if id is defined', async () => {
      await pgUserRepository.save({ email: 'any_email', name: 'any_name', googleId: 'any_google_id' })

      const { id } = await sut.saveWithGoogle({ id: '1', email: 'new_email', name: 'new_name', googleId: 'new_google_id' })

      const pgUser = await pgUserRepository.findOne({ where: { id: 1 } })

      expect(pgUser).toEqual({ id: 1, email: 'any_email', name: 'new_name', googleId: 'new_google_id' })
      expect(id).toBe('1')
    })
  })
})
