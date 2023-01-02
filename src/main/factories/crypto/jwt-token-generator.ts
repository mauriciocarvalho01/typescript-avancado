import { JwtTokenGenerator } from '@/infra/crypto'
import { Environments } from '@/main/config/environments'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  const env = Environments.instance.getEnvironments()
  return new JwtTokenGenerator(env.secret)
}
