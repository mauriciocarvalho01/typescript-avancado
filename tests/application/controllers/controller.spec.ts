import { ServerError } from '@/application/errors'
import { Controller } from '@/application/controllers'
import { ValidationComposite } from '@/application/validation/composite'
import { HttpResponse } from '../helpers'

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data'
  }

  async perform (HttpRequest: any): Promise<HttpResponse<any>> {
    return this.result
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
  })

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementation(() => {
      return {
        validate: jest.fn().mockReturnValueOnce(error)
      }
    })

    jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle('any_value')

    expect(ValidationComposite).toHaveBeenCalledWith([])

    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: error
      })
  })
  it('Should return 500 if perform throws', async () => {
    const error = new Error('perform_error')
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(
      {
        statusCode: 500,
        data: new ServerError(error)
      }
    )
  })

  it('Should return same result as perform', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
