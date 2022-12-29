import './config/module-alias'

import { Environments } from '@/main/config/environments'
import { app } from '@/main/config/app'
import 'reflect-metadata'

const env = Environments.instance.getEnvironments()
const port: string = env.port

app.listen(port, () => { console.log(`Server running at http://localhost:${port}`) })
