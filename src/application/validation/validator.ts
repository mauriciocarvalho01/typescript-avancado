import { ValidationComposite, ValidationBuilder } from '@/application/validation'
import { httpRequest } from '@/application/helpers'

export interface Validator {
  validate: () => Error | undefined
}

export class Validation {
  validate (httpRequest: httpRequest): Error | undefined {
    return new ValidationComposite([
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
    ]).validate()
  }
}
