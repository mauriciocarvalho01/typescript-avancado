// import { app } from '@/main/config/app'
// import { makeConnection, FakeDb } from '@/tests/infra/database/postgres/mocks'
// import { PgUser } from '@/infra/database/postgres/entities'

// import request from 'supertest'
// import { IBackup } from 'pg-mem'

// describe('Login Routes', () => {
//   describe('POST /login/google', () => {
//     let backup: IBackup
//     let fakeDb: FakeDb
//     beforeAll(async () => {
//       fakeDb = await makeConnection([PgUser])
//       backup = fakeDb.db.backup()
//     })

//     beforeEach(() => {
//       backup.restore()
//     })
//     it('Should return to 200 with AccessToken', async () => {
//       await request(app)
//         .post('api/login/google')
//         .send({ token: 'valid_token' })
//         .expect(200)
//     })
//   })
// })
