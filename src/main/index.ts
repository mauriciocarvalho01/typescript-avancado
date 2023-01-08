import './config/module-alias'

import { Environments } from '@/main/config/environments'
import { PgConnection } from '@/infra/database/postgres/helpers'
import 'reflect-metadata'

const env = Environments.instance.getEnvironments()

PgConnection.instance.connect()
  .then(async () => {
    const { app } = await import('@/main/config/app')
    const port: string = env.port
    app.listen(env.port, () => console.log(`Server running at http://localhost:${port}`))
  })
  .catch(console.error)
