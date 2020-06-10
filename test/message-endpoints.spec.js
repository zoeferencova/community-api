const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Messages Endpoints', function() {
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


    describe(`POST /messages`, () => {
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

        it(`creates a new message, responding with 201 and the new message`, () => {
            const chatId = 1;

            const newMessage = {
                chat_id: chatId,
                message_content: 'hi',
            }

            return supertest(app)
                .post('/api/messages')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newMessage)
                .expect(201)
                .then(res => {
                    return supertest(app)
                        .get(`/api/chats`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(200)
                        .expect(res => {
                            const chat = res.body.find(chat => chat.id === chatId)
                            const message = chat.messages[0]
                            expect(message.id).to.eql(7)
                            expect(message).to.have.property('message_timestamp')
                            expect(message.chat_id).to.eql(newMessage.chat_id)
                            expect(message.message_content).to.eql(newMessage.message_content)
                            expect(message.sender_id).to.eql(testUsers[0].id)
                        })
                })
        })

        const requiredFields = ['chat_id', 'message_content'];

        requiredFields.forEach(field => {
            const newMessage = {
                chat_id: 1,
                message_content: 'hi',
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newMessage[field]

                return supertest(app)
                    .post('/api/messages')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(newMessage)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
        
        it(`responds with 400 and an error message when the supplied chat_id is not valid`, () => {
            const newMessage = {
                chat_id: 1234,
                message_content: 'hi',
            }

            return supertest(app)
                    .post('/api/messages')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(newMessage)
                    .expect(400, {
                        error: { message: `There is no chat with an id of ${newMessage.chat_id}` }
                    })
        })

        it(`responds with 400 and an error message when the user is not part of the chat with the supplied chat_id`, () => {
            const newMessage = {
                chat_id: 2,
                message_content: 'hi',
            }

            return supertest(app)
                    .post('/api/messages')
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .send(newMessage)
                    .expect(400, {
                        error: { message: `Current user is not part of the chat with the id of ${newMessage.chat_id}` }
                    })
        })
    })
})