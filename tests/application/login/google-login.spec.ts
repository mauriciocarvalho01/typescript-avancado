describe('GoogleLoginController', () => {
  it('Should return if token is empty ', async () => {
    const sut = new GoogleLoginController()

    const httpResponse = await sut.handle({ token: '' })
    expect(httpResponse).toEqual(
      {
        statusCode: 400,
        data: new Error('The field token is required')
      }
    )
  })
})

type httpResponse = {
  statusCode: number
  data: any
}

class GoogleLoginController {
  async handle (httpRequest: any): Promise<httpResponse> {
    return {
      statusCode: 400,
      data: new Error('The field token is required')
    }
  }
}
