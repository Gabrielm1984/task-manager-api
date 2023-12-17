const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('1 - Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Gabriel',
        email: 'gabrielm_1984@hotmail.com',
        password: 'Aa123456@'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    
    //Assert that database was chanded correctly
    expect(user).not.toBeNull()

    //Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Gabriel',
            email: 'gabrielm_1984@hotmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Aa123456@')
})

test('2 - Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect((response.body.token)).toBe(user.tokens[1].token)
})

test('3 - Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'test@test.com',
        password: userOne.password
    }).expect(400)
})

test('4 - Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('5 - Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('6 - Should delete account for user', async () => {
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('7 - Should not delete account for unauthenticated user', async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)

    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()
})

test('8 - Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('9 - Should update users name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Michal'
        })
        .expect(200)
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('Michal')
})

test('10 - Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            sex: 'm'
        })
        .expect(400)
})

test('11 - Should not signup user with invalid name', async () => {
    await request(app)
        .post('/users')
        .send({
                "email": "gabriel@email.com",
                "age": 39,
                "password": "Aa123456@"
            })
            .expect(400)
})

test('12 - Should not signup user with invalid email', async () => {
    await request(app)
        .post('/users')
        .send({
                "name": "test",
                "email": "gabriel@email",
                "age": 39,
                "password": "Aa123456@"
            })
            .expect(400)
})

test('13 - Should not signup user with invalid password', async () => {
    await request(app)
        .post('/users')
        .send({
                "email": "gabriel@email.com",
                "age": 39,
                "password": "123"
            })
            .expect(400)
})

test('14 - Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
                "name": "SHOULD NOT UPDATE",
            })
            .expect(401)
})

test('15 - Should not update user with invalid name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "name": ""
        })
})

test('16 - Should not update user with invalid email', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "email": "SHOULD NOT UPDATE"
        })
        .expect(400)
})

test('17 - Should not update user with invalid password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "password": "123"
        })
        .expect(400)
})

test('18 - Should not delete user if unauthenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('19 - Should delete user if authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})