const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Chats Endpoints', function() {
    let db;

    const { testUsers, testPosts, testCategories, testPostCategoryAssoc, testChats, testMessages } = helpers.makeFixtures();

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

    describe('GET /api/chats', () => {
        beforeEach('insert data', () =>
            helpers.seedTables(
                db,
                testUsers,
                testPosts,
                testCategories,
                testPostCategoryAssoc,
                testChats,
                testMessages
            )
        )
    
        it(`responds with all chats that include the current user`, () => {
            const userChats = testChats.filter(chat => chat.user1_id === testUsers[2].id || chat.user2_id === testUsers[2].id)
            const expectedChats = helpers.makeExpectedChats(userChats, testUsers, testPosts, testMessages)

            return supertest(app)
                .get('/api/chats')
                .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                .expect(200, expectedChats)
        })
    })

    describe(`POST /chats`, () => {
        const testUser = testUsers[0];
        beforeEach('insert data', () =>
            helpers.seedTables(
                db,
                testUsers,
                testPosts,
                testCategories,
                testPostCategoryAssoc,
                testChats,
                testMessages
            )
        )

        it(`creates a new chat, responding with 201 and the new chat`, () => {
            const newChat = {
                user2Id: 1,
                postId: 1,
            }

            return supertest(app)
                .post('/api/chats')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newChat)
                .expect(201)
                .then(res => {
                    return supertest(app)
                        .get(`/api/chats/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200)
                        .expect(res => {
                            expect(newChat)
                        })
                })
        })

        const requiredFields = ['user2Id', 'postId'];

        requiredFields.forEach(field => {
            const newChat = {
                user2Id: 1,
                postId: 1
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newChat[field]

                return supertest(app)
                    .post('/api/chats')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newChat)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        }) 
    })

    describe(`GET /api/chats/:id`, () => {
        context(`Given the chat doesn't exist`, () => {
            beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc,
                    testChats,
                    testMessages
                )
            )

            it(`responds with 404`, () => {
                const chatId = 123456;
                return supertest(app)
                    .get(`/api/chats/${chatId}`)
                    .expect(404, { error: { message: `Chat doesn't exist` } })
            })
        })

        context(`Given the chat exists`, () => {
            beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc,
                    testChats,
                    testMessages
                )
            )

            it(`responds with 200 and the requested chat`, () => {
                const requestedChat = testChats[2];
                const expectedChat = helpers.makeExpectedChats(testChats, testUsers, testPosts, testMessages)[requestedChat.id - 1]

                delete expectedChat.messages;

                return supertest(app)
                    .get(`/api/chats/${requestedChat.id}`)
                    .expect(200, expectedChat)
            })
        })
    })

    describe(`DELETE /chats/:id`, () => {
        context(`Given the chat doesn't exist`, () => {
            beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc,
                    testChats,
                    testMessages
                )
            )

            it('responds with 404', () => {
                const chatId = 12345;
                return supertest(app)
                    .delete(`/api/chats/${chatId}`)
                    .expect(404, { error: { message: `Chat doesn't exist` } })
            })
        })

        context(`Given the chat does exist`, () => {
            beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc,
                    testChats,
                    testMessages
                )
            )

            it(`responds with 204 and removes the chat`, () => {
                const idToRemove = 2;
                const chatUserId = testChats[idToRemove-1].user2_id;

                return supertest(app)
                    .delete(`/api/chats/${idToRemove}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[chatUserId-1]))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get(`/api/chats/${idToRemove}`)
                            .expect(404)
                    })
            })
        })
    })
})