const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
    let db;

    const { testUsers } = helpers.makeFixtures();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['email', 'password', 'first_name'];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'test@gmail.com',
                    password: 'TestPass1!',
                    first_name: 'Test'
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field];
    
                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })

                it(`responds 400 'Password must be longer than 8 characters' when short password`, () => {
                    const userShortPassword = {
                        email: 'test@gmail.com',
                        password: '1234567',
                        first_name: 'Test'
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(userShortPassword)
                        .expect(400, { error: `Password must be longer than 8 characters` })
                })

                it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                    const userLongPassword = {
                        email: 'test@gmail.com',
                        password: 'TestPass1!' + '*'.repeat(73),
                        first_name: 'Test'
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(userLongPassword)
                        .expect(400, { error: `Password must be less than 72 characters` })
                })

                it(`responds 400 error when password starts with spaces`, () => {
                    const userPasswordStartsSpaces = {
                        email: 'test@gmail.com',
                        password: '  1Aa!2Bb@',
                        first_name: 'Test',
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordStartsSpaces)
                        .expect(400, { error: `Password must not start or end with empty spaces` })
                })

                it(`responds 400 error when password ends with spaces`, () => {
                    const userPasswordEndsSpaces = {
                        email: 'test@gmail.com',
                        password: '1Aa!2Bb@ ',
                        first_name: 'Test',
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordEndsSpaces)
                        .expect(400, { error: `Password must not start or end with empty spaces` })
                })

                it(`responds 400 error when password isn't complex enough`, () => {
                    const userPasswordNotComplex = {
                        email: 'test@gmail.com',
                        password: 'TestPass1',
                        first_name: 'Test',
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordNotComplex)
                        .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
                })

                it(`responds 400 'Email is already taken' when email isn't unique`, () => {
                    const duplicateUser = {
                        email: testUser.email,
                        password: 'TestPass1!',
                        first_name: 'Test'
                    }

                    return supertest(app)
                        .post('/api/users')
                        .send(duplicateUser)
                        .expect(400, { error: `Email already taken` })
                })
            })

            
        })

        context('Happy path', () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: 'test@gmail.com',
                    password: 'TestPass1!',
                    first_name: 'Test'
                }
    
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body.first_name).to.eql(newUser.first_name)
                        expect(res.body.location).to.eql(null)
                        expect(res.body.radius).to.eql(null)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
            })
        })
    })

    describe('GET /api/users', () => {
        beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )
        it(`responds with information for the current user`, () => {
            const expectedUserInformation = helpers.makeExpectedUserInformation(testUsers[2])
            return supertest(app)
                .get('/api/users')
                .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                .expect(200, expectedUserInformation)
        })
    })

    describe(`PATCH /api/users/:id/`, () => {
        context(`Given the user doesn't exist`, () => {
            it(`responds with 404`, () => {
                const userId = 123456;
                return supertest(app)
                    .patch(`/api/users/${userId}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context('Given the user does exist', () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            it(`responds with 204 and updates the user information`, () => {
                const idToUpdate = 3;
                const updateUser = {
                    // LIC
                    location: 'POINT(-73.9341 40.7628)',
                    radius: '1609.34'
                }

                const expectedUserInformation = helpers.makeExpectedUserInformation(testUsers[idToUpdate-1])
                
                const expectedValues = {
                    // LIC
                    location: { lat: 40.7628, lng: -73.9341 },
                    radius: (1).toFixed(2)
                }


                const expectedUser = {
                    ...expectedUserInformation,
                    ...expectedValues
                }

                
                return supertest(app)
                    .patch(`/api/users/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[idToUpdate-1]))
                    .send(updateUser)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/users/`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[idToUpdate-1]))
                            .expect(expectedUser)    
                    )
            })

            it(`responds with 400 when no relevant fields supplied`, () => {
                const idToUpdate = 3;
                
                return supertest(app)
                    .patch(`/api/users/${idToUpdate}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[idToUpdate-1]))
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'first_name', 'email', 'password', location' or 'radius'.`
                        }
                    })
            })
        })
    })

    describe(`DELETE /users/:id`, () => {
        context(`Given the user doesn't exist`, () => {
            it(`responds with 404`, () => {
                const userId = 123456;
                return supertest(app)
                    .delete(`/api/users/${userId}`)
                    .expect(404, { error: { message: `User doesn't exist` } })
            })
        })

        context(`Given the user does exist`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            it(`responds with 204 and removes the user`, () => {
                const idToRemove = 2;

                return supertest(app)
                    .delete(`/api/users/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[idToRemove-1]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/users/${idToRemove}`)
                            .expect(404, { error: { message: `User doesn't exist` } })
                    })
            })
        })  
    })
})