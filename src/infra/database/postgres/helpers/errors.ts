export class DatasourceNotFoundError extends Error {
  constructor () {
    super('No datasource was found')
    this.name = this.constructor.name
  }
}

export class TransactionNotFoundError extends Error {
  constructor () {
    super('No transaction was found')
    this.name = this.constructor.name
  }
}
