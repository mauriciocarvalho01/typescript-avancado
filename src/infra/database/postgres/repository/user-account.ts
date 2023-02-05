import { LoadUserAccountRepository, SaveGoogleAccountRepository } from '@/data/contracts/repository'
import { PgUser } from '@/infra/database/postgres/entities'

import { Repository, ObjectLiteral } from 'typeorm'
import { PgRepository } from './repository'

type LoadParams = LoadUserAccountRepository.Input
type LoadResult = LoadUserAccountRepository.Output
type SaveParams = SaveGoogleAccountRepository.Input
type SaveResult = SaveGoogleAccountRepository.Output

export class PgUserAccountRepository extends PgRepository implements LoadUserAccountRepository, SaveGoogleAccountRepository {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepository: Repository<ObjectLiteral> = this.getRepository(PgUser)
    const pgUser = await pgUserRepository.findOne({
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
    const pgUserRepository: Repository<ObjectLiteral> = this.getRepository(PgUser)
    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepository.save({ email, name, googleId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await pgUserRepository.update({ id: parseInt(id) }, { name, googleId })
    }
    return { id: resultId }
  }
}
