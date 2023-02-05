import { JwtTokenGenerator } from '@/infra/crypto'
import { Environments } from '@/environments'

export const makeJwtTokenGenerator = (): JwtTokenGenerator => {
  const env = Environments.instance.getEnvironments()
  return new JwtTokenGenerator(env.secret)
}
