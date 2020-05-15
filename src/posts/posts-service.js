const xss = require('xss')
const knexPostgis = require('knex-postgis')

const PostsService = {
    getUserPosts(db, userId) {
        const st = knexPostgis(db)
        return db
            .from('community_posts')
            .join('community_categories_post_assoc', { 'community_categories_post_assoc.post_id': 'community_posts.id' })
            .join('community_users', { 'community_posts.user_id': 'community_users.id' })
            .join('community_categories', { 'community_categories.id': 'community_categories_post_assoc.category_id' })
            .select(
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
}

module.exports = PostsService;