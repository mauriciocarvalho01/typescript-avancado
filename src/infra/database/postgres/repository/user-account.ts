import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/database/postgres/entities'

import { DataSource, Repository } from 'typeorm'

type LoadParams = LoadUserAccountRepository.Input
type LoadResult = LoadUserAccountRepository.Output
type SaveParams = SaveGoogleAccountRepository.Input
type SaveResult = SaveGoogleAccountRepository.Output

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveGoogleAccountRepository {
  private readonly pgUserRepository: Repository<PgUser>
  constructor (private readonly dataSource: DataSource) {
    this.pgUserRepository = this.dataSource.getRepository(PgUser)
  }

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({
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

  async saveWithGoogle (params: SaveParams): Promise<SaveResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        googleId: params.googleId
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepository.update({ id: parseInt(params.id) }, { name: params.name, googleId: params.googleId })
    }
    return { id }
  }
}
