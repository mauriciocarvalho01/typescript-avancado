// Packages
import dotenv from 'dotenv'
import path from 'path'

export class Environments {
  private static callCount: number = 0
  private static _instance: Environments | null = null
  public static get instance (): Environments {
    if (this._instance === null) {
      this._instance = new Environments()
      this.callCount++
    }
    return this._instance
  }

  getEnvironments (): any {
    console.log(`Call Count Environments: ${Environments.callCount}`)
    const testEnvironment: string = 'test'
    const environment: string | undefined = process.env.NODE_ENV
    const environmentPath: string = path.join(__dirname, `.env.${environment ?? testEnvironment}`)
    console.log(`Environment: ${environmentPath}`)

    dotenv.config({ path: environmentPath })
    return {
      environmentPath: environmentPath ?? undefined,
      environment: environment ?? testEnvironment,
      port: process.env.PORT ?? 3000,
      secret: process.env.SECRET_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleClientToken: process.env.GOOGLE_CLIENT_TOKEN,
      database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
      }
    }
  }
}
