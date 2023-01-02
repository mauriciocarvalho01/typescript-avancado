import { PgUserAccountRepository } from '@/infra/database/postgres/repository'
import { DataSource } from 'typeorm'
export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  let dataSource: DataSource
  return new PgUserAccountRepository(dataSource)
}
