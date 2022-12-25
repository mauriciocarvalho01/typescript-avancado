import { ProviderClient } from '@/infra/gateways'

export class GoogleProvider implements ProviderClient {
  async verifyIdToken (params: ProviderClient.Input): Promise<any> {

  }
}
