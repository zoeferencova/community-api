const knex = require('knex');
const knexPostgis = require('knex-postgis');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Posts Endpoints', function() {
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
            const userPosts = testPosts.filter(post => post.user_id === testUsers[2].id)
            const expectedPosts = helpers.makeExpectedPosts(userPosts, testUsers, testCategories, testPostCategoryAssoc)
            return supertest(app)
                .get('/api/posts')
                .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                .expect(200, expectedPosts)
        })
    })

    describe('GET /api/posts/neighborhood-posts', () => {
        beforeEach('insert data', () =>
            helpers.seedTables(
                db,
                testUsers,
                testPosts,
                testCategories,
                testPostCategoryAssoc
            )
        )

        it(`responds with all posts within the current user's radius`, () => {
            // TEST LOCATION POINT: 'POINT(-73.8903 40.7512)'
            const expectedPosts = helpers.makeExpectedPosts(testPosts, testUsers, testCategories, testPostCategoryAssoc)
            
            // Known calculated values for each distance to test against PostGIS distance values
            expectedPosts[0].distance_from_user = "1327";
            expectedPosts[1].distance_from_user = "656";
            expectedPosts[2].distance_from_user = "0";
            expectedPosts[3].distance_from_user = "0";
            
            // Filtering according to user's radius to simulate PostGIS' dwithin function
            const filteredPosts = expectedPosts.filter(post => Number(post.distance_from_user) <= Number(testUsers[2].radius))
            return supertest(app)
                .get('/api/posts/neighborhood-posts')
                .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
                .expect(200, filteredPosts)
        })
    })

    describe(`POST /posts`, () => {
        const testUser = testUsers[0];
        beforeEach('insert data', () =>
            helpers.seedTables(
                db,
                testUsers,
                testPosts,
                testCategories,
                testPostCategoryAssoc
            )
        )

        it(`creates a new post, responding with 201 and the new post`, () => {
            const newPost = {
                post_type: 'request',
                description: 'New post',
                urgency: 'low',
                category_ids: [1, 2]
            }

            return supertest(app)
                .post('/api/posts')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(newPost)
                .expect(201)
                .then(res => {
                    return supertest(app)
                        .get(`/api/posts/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200)
                        .expect(res => {
                            expect(res.body.post_type).to.eql(newPost.post_type)
                            expect(res.body.description).to.eql(newPost.description)
                            expect(res.body.urgency).to.eql(newPost.urgency)
                            expect(res.body).to.have.property('id')
                            expect(res.body).to.have.property('date_created')
                            expect(res.body.categories.length).to.eql(newPost.category_ids.length)
                        })
                })
        })

        const requiredFields = ['post_type', 'category_ids'];

        requiredFields.forEach(field => {
            const newPost = {
                post_type: 'request',
                category_ids: [1, 2]
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newPost[field]

                return supertest(app)
                    .post('/api/posts')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newPost)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        }) 
    })

    describe(`PATCH /api/posts/:id`, () => {
        context(`Given the post doesn't exist`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456;
                return supertest(app)
                    .patch(`/api/posts/${itemId}`)
                    .expect(404, { error: { message: `Post doesn't exist` } })
            })
        })

        context('Given the post exists', () => {
            beforeEach('insert data', () =>
                helpers.seedTables(
                    db,
                    testUsers,
                    testPosts,
                    testCategories,
                    testPostCategoryAssoc
                )
            )

            it(`responds with 204, deletes old category-post associations and inserts new ones if only category_ids are supplied in update object`, () => {
                const idToUpdate = 3;
                const updateItem = {
                    category_ids: [1, 2]
                }

                const expectedItem = helpers.makeExpectedPosts([testPosts[idToUpdate-1]], testUsers, testCategories, testPostCategoryAssoc)[0]
                const formattedCategories = updateItem.category_ids.map(catId => {
                    const foundCategory = testCategories.find(cat => cat.id === catId)
                    return foundCategory.category;
                })

                expectedItem.categories = formattedCategories;
                delete expectedItem.category_ids;

                return supertest(app)
                    .patch(`/api/posts/${idToUpdate}`)
                    .send(updateItem)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/posts/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })

            it(`responds with 204, deletes old category-post associations and inserts new ones and updates additional fields when category_ids and other fields are present`, () => {
                const idToUpdate = 3;
                const updateItem = {
                    category_ids: [1, 2],
                    urgency: 'low',
                    description: 'description'
                }

                const formattedItem = helpers.makeExpectedPosts([testPosts[idToUpdate-1]], testUsers, testCategories, testPostCategoryAssoc)[0]
                const formattedCategories = updateItem.category_ids.map(catId => {
                    const foundCategory = testCategories.find(cat => cat.id === catId)
                    return foundCategory.category;
                })

                formattedItem.categories = formattedCategories;
                delete formattedItem.category_ids;

                const expectedItem = {
                    ...formattedItem,
                    ...updateItem
                }

                delete expectedItem.category_ids;

                return supertest(app)
                    .patch(`/api/posts/${idToUpdate}`)
                    .send(updateItem)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/posts/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })

            it(`responds with 204 and updates relevant fields when only fields that are not category_ids are present`, () => {
                const idToUpdate = 1;
                const updateItem = {
                    urgency: 'low',
                    description: 'description'
                }

                const formattedItem = helpers.makeExpectedPosts([testPosts[idToUpdate-1]], testUsers, testCategories, testPostCategoryAssoc)[0]

                const expectedItem = {
                    ...formattedItem,
                    ...updateItem
                }

                return supertest(app)
                    .patch(`/api/posts/${idToUpdate}`)
                    .send(updateItem)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/posts/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })

            it(`responds with 400 when no relevant fields supplied`, () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/api/posts/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'category_ids', 'description' or 'urgency'.`
                        }
                    })
            })

            it(`responds with 400 when category_ids array is updated with an empty array`, () => {
                const idToUpdate = 3;
                return supertest(app)
                    .patch(`/api/posts/${idToUpdate}`)
                    .send({ category_ids: [] })
                    .expect(400, {
                        error: {
                            message: `'category_ids' must include at least one value.`
                        }
                    })
            })
        })
    })
})