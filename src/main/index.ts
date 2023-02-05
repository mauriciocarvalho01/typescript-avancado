import './config/module-alias'

import { Environments } from '@/environments'
import { PgConnection } from '@/infra/database/postgres/helpers'
import 'reflect-metadata'

const env = Environments.instance.getEnvironments()

const pgConnection = PgConnection.instance
pgConnection.connect().then(async () => {
  const { app } = await import('@/main/config/app')
  const port: string = env.port
  app.listen(env.port, () => console.log(`Server running at http://localhost:${port}`))
})
  .catch(async (error) => {
    console.error(error)
    await pgConnection.disconnect()
  })
