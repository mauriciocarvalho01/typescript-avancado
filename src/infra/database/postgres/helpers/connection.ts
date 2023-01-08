import { DataSource, DataSourceOptions, ObjectLiteral, ObjectType, Repository } from 'typeorm'
import { ConnectionNotFoundError, OrmConfigOptions } from '@/infra/database/postgres/helpers'

export class PgConnection {
  private static callCount: number = 0
  private static _instance: PgConnection | null = null
  private datasource!: DataSource | undefined
  public static get instance(): PgConnection {
    if (this._instance === null) {
      this._instance = new PgConnection()
      this.callCount++
    }
    return this._instance
  }

  async connect (): Promise<void> {
    console.log(OrmConfigOptions)
    this.datasource = new DataSource(OrmConfigOptions as DataSourceOptions)
    this.datasource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
      })
      .catch((error) => {
        console.error('Error during Data Source initialization', error)
      })
  }

  async disconnect (): Promise<void> {
    if (this.datasource === undefined) throw new ConnectionNotFoundError()
    await this.datasource.destroy()
  }

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<ObjectLiteral> {
    if (this.datasource === undefined) throw new ConnectionNotFoundError()
    return this.datasource.getRepository(entity)
  }
}
