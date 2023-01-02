import { adapterExpressRoute as adapt } from '@/infra/http'
import { Router } from 'express'
import { makeGoogleLoginController } from '@/main/factories/controlles'

export default (router: Router): void => {
  router.post('/api/login/google', adapt(makeGoogleLoginController()))
}
