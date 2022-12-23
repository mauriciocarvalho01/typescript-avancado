
type GoogleModel = {
  name: string
  email: string
  googleId: string
}

type AccountModel = {
  id?: string
  name?: string
}

export class GoogleAccount {
  id?: string
  name: string
  email: string
  googleId: string

  constructor (googleModel: GoogleModel, accountModel?: AccountModel) {
    this.id = accountModel?.id
    this.name = accountModel?.name ?? googleModel.name
    this.email = googleModel.email
    this.googleId = googleModel.googleId
  }
}
