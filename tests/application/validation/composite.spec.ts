import { mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  it('Should return undefined if all Validators return undefined', () => {
    const validator1 = mock<Validator>()
    validator1.validate.mockReturnValue(undefined)
    const validator2 = mock<Validator>()
    validator2.validate.mockReturnValue(undefined)
    const validators: Validator[] = [validator1, validator2]

    const sut = new ValidationComposite(validators)
    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})

interface Validator {
  validate: () => Error | undefined
}

class ValidationComposite {
  constructor (private readonly validator: Validator[]) { }
  validate (): undefined {
    return undefined
  }
}
