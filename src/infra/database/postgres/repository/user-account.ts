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

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({
      where:
        { email }
    })
    if (pgUser !== undefined && pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithGoogle ({ id, email, name, googleId }: SaveParams): Promise<SaveResult> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.pgUserRepository.save({ email, name, googleId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.pgUserRepository.update({ id: parseInt(id) }, { name, googleId })
    }
    return { id: resultId }
  }
}
