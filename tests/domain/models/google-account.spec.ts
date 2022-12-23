import { GoogleAccount } from '@/domain/models/google-account'

describe('Google Account', () => {
  const googleData = {
    name: 'any_google_name',
    email: 'any_google_email',
    googleId: 'any_google_id'
  }

  it('Should create with google data only', () => {
    const sut = new GoogleAccount(googleData)

    expect(sut).toEqual(googleData)
  })

  it('Should update name if is empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new GoogleAccount(googleData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_google_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
  })

  it('Should not update name if is not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new GoogleAccount(googleData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_google_email',
      googleId: 'any_google_id'
    })
  })
})
