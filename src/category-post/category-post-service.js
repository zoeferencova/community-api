const CategoryPostService = {
    insertAssoc(db, postId, assocArray) {
        assocArray.map(assoc => assoc.post_id = parseInt(postId))
        return db 
            .insert(assocArray)
            .into('community_categories_post_assoc')
            .returning('*')
    },
    deleteAssoc(db, postId) {
        return db
            .from('community_categories_post_assoc')
            .where({ post_id: postId })
            .del()
    },
    makeObjectArray(catIds) {
        const catIdArray = []
        catIds.forEach(cat => {
            catIdArray.push({
                category_id: parseInt(cat)
            })
        });
        return catIdArray;
    }
}

module.exports = CategoryPostService;