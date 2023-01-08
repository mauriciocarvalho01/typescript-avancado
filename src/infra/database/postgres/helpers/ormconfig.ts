import { Environments } from '@/main/config/environments'
const env = Environments.instance.getEnvironments()

console.log(env.environment)
export const OrmConfigOptions = {
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.database,
  entities: [
    `${env.environment === 'production' ? 'dist' : 'src'}/infra/database/**/*.entity.{js,ts}`
  ]
}
