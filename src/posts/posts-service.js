const xss = require('xss');
const knexPostgis = require('knex-postgis');
const CategoryPostService = require('../category-post/category-post-service');

const PostsService = {
    getPostById(db, postId) {
        const st = knexPostgis(db)
        return db
            .from('community_posts')
            .join('community_categories_post_assoc', { 'community_categories_post_assoc.post_id': 'community_posts.id' })
            .join('community_users', { 'community_posts.user_id': 'community_users.id' })
            .join('community_categories', { 'community_categories.id': 'community_categories_post_assoc.category_id' })
            .select(
                'community_posts.id',
                'community_posts.post_type',
                'community_posts.description',
                'community_posts.urgency',
                'community_posts.date_created',
                st.asText('community_users.location').as('location'),
                'community_users.radius',
                'community_users.first_name',
                db.raw('array_agg(community_categories.category) as categories')
            )
            .groupBy('community_posts.id', 'community_users.location', 'community_users.radius', 'community_users.first_name')
            .where({ 'community_posts.id': postId })
            .first()
    },
    getUserPosts(db, userId) {
        const st = knexPostgis(db)
        return db
            .from('community_posts')
            .join('community_categories_post_assoc', { 'community_categories_post_assoc.post_id': 'community_posts.id' })
            .join('community_users', { 'community_posts.user_id': 'community_users.id' })
            .join('community_categories', { 'community_categories.id': 'community_categories_post_assoc.category_id' })
            .select(
                'community_posts.id',
                'community_posts.post_type',
                'community_posts.description',
                'community_posts.urgency',
                'community_posts.date_created',
                st.asText('community_users.location').as('location'),
                'community_users.radius',
                'community_users.first_name',
                db.raw('array_agg(community_categories.category) as categories')
            )
            .where({ 'community_posts.user_id': userId })
            .groupBy('community_posts.id', 'community_users.location', 'community_users.radius', 'community_users.first_name')
    },
    getNeighborhoodPosts(db, user) {
        const st = knexPostgis(db)
        return db
            .from('community_posts')
            .join('community_categories_post_assoc', { 'community_categories_post_assoc.post_id': 'community_posts.id' })
            .join('community_users', { 'community_posts.user_id': 'community_users.id' })
            .join('community_categories', { 'community_categories.id': 'community_categories_post_assoc.category_id' })
            .select(
                'community_posts.id',
                'community_posts.post_type',
                'community_posts.description',
                'community_posts.urgency',
                'community_posts.date_created',
                st.asText('community_users.location').as('location'),
                'community_users.radius',
                'community_users.first_name',
                db.raw(`ROUND(ST_DistanceSphere(ST_GeomFromText('${user.location}', 4326), ST_GeomFromText(ST_asText(community_users.location), 4326))::numeric, 0) AS distance_from_user`),
                db.raw('array_agg(community_categories.category) as categories')
            )
            .where(st.dwithin(user.location, 'location', user.radius))
            .groupBy('community_posts.id', 'community_users.location', 'community_users.radius', 'community_users.first_name')
    },
    insertPost(db, newPost, catIds) {
        return db
            .insert(newPost)
            .into('community_posts')
            .returning('id')
            .then(res => CategoryPostService.insertAssoc(db, parseInt(res), catIds))
            .then(([assoc]) => assoc)
            .then(assoc => {
                return PostsService.getPostById(db, parseInt(assoc.post_id))
            })           
    },
    updatePost(db, postId, newPost) {
        return db
            .from('community_posts')
            .where({ id: parseInt(postId) })
            .update(newPost)
    }
}

module.exports = PostsService;