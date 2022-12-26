import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/database/postgres/entities'

import { DataSource } from 'typeorm'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  constructor (private readonly dataSource: DataSource) { }
  async load (params: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
    const pgUserRepository = this.dataSource.getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({
      where:
        { email: params.email }
    })
    if (pgUser !== undefined && pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithGoogle (params: SaveGoogleAccountRepository.Input): Promise<void> {
    const pgUserRepository = this.dataSource.getRepository(PgUser)
    if (params.id === undefined) {
      await pgUserRepository.save({
        email: params.email,
        name: params.name,
        googleId: params.googleId
      })
    } else {
      await pgUserRepository.update({ id: parseInt(params.id) }, { name: params.name, googleId: params.googleId })
    }
  }
}
