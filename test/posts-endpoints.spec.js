const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
    let db;

    const { testUsers, testPosts, testCategories, testPostCategoryAssoc } = helpers.makeFixtures();

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

    describe('GET /api/posts', () => {
        beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc
                )
            )
    
        it(`responds with all posts created by the current user`, () => {
            const expectedPosts = helpers.makeExpectedPosts(testPosts, testUsers[2], testCategories, testPostCategoryAssoc)
            console.log(expectedPosts)
            return supertest(app)
                .get('/api/posts')
                .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                .expect(200, expectedPosts)
        })
    })
})