import { PgConnection } from '@/infra/database/postgres/helpers'

import { ObjectType, Repository, ObjectLiteral } from 'typeorm'

export abstract class PgRepository {
  constructor (private readonly connection: PgConnection = PgConnection.instance) {}

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<ObjectLiteral>{
    return this.connection.getRepository(entity)
  }
}
