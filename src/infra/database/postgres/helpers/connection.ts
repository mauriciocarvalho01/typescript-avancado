import { DataSource, DataSourceOptions, ObjectLiteral, ObjectType, Repository } from 'typeorm'
import { DatasourceNotFoundError, OrmConfigOptions } from '@/infra/database/postgres/helpers'

export class PgConnection {
  private static _instance: PgConnection | null = null
  private datasource!: DataSource | undefined
  public static get instance (): PgConnection {
    if (this._instance === null) {
      this._instance = new PgConnection()
    }
    return this._instance
  }

  async connect (): Promise<void> {
    this.datasource = new DataSource(OrmConfigOptions as DataSourceOptions)
    if (this.datasource === undefined) throw new DatasourceNotFoundError()
    await this.datasource.initialize()
    console.log('Data Source has been initialized!')
  }

  async disconnect (): Promise<void> {
    if (this.datasource === undefined) throw new DatasourceNotFoundError()
    await this.datasource.destroy()
    console.log('Data Source has been disconnected!')
  }

  getRepository<Entity>(entity: ObjectType<Entity>): Repository<ObjectLiteral> {
    if (this.datasource === undefined) throw new DatasourceNotFoundError()
    return this.datasource.getRepository(entity)
  }
}
