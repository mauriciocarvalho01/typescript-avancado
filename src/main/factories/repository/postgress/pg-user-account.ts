import { PgUserAccountRepository } from '@/infra/database/postgres/repository'
export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
