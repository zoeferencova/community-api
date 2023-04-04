const ChatsService = {
    getChatById(db, chatId) {
        return db
            .from('community_chats')
            .join('community_users AS users1', { 'users1.id': 'community_chats.user1_id' })
            .join('community_users AS users2', { 'users2.id': 'community_chats.user2_id' })
            .join('community_messages AS messages', { 'messages.chat_id': 'community_chats.id' })
            .join('community_posts as posts', { 'posts.id': 'community_chats.post_id' })
            .select(
                'community_chats.id',
                db.raw(`json_build_object('first_name', users1.first_name, 'id', users1.id) AS user1`),
                db.raw(`json_build_object('first_name', users2.first_name, 'id', users2.id) AS user2`),
                db.raw(`json_build_object('id', posts.id, 'user_id', posts.user_id, 'post_type', posts.post_type, 'description', posts.description, 'urgency', posts.urgency, 'date_created', posts.date_created) AS post`),
                db.raw(`json_agg(json_build_object('id', messages.id, 'sender_id', messages.sender_id, 'chat_id', messages.chat_id, 'message_content', messages.message_content, 'message_timestamp',messages.message_timestamp::timestamptz) ORDER BY message_timestamp) as messages`),
            )
            .where('community_chats.id', '=', chatId)
            .groupBy('community_chats.id', 'users1.id', 'users2.id', 'posts.id')
            .first()
    },
    getNewChatById(db, chatId) {
        return db
            .from('community_chats')
            .join('community_users AS users1', { 'users1.id': 'community_chats.user1_id' })
            .join('community_users AS users2', { 'users2.id': 'community_chats.user2_id' })
            .join('community_posts as posts', { 'posts.id': 'community_chats.post_id' })
            .select(
                'community_chats.id',
                db.raw(`json_build_object('first_name', users1.first_name, 'id', users1.id) AS user1`),
                db.raw(`json_build_object('first_name', users2.first_name, 'id', users2.id) AS user2`),
                db.raw(`json_build_object('id', posts.id, 'user_id', posts.user_id, 'post_type', posts.post_type, 'description', posts.description, 'urgency', posts.urgency, 'date_created', posts.date_created) AS post`),
            )
            .where('community_chats.id', '=', chatId)
            .groupBy('community_chats.id', 'users1.id', 'users2.id', 'posts.id')
            .first()
    },
    getUserChats(db, userId) {
        return db
            .from('community_chats')
            .join('community_users AS users1', { 'users1.id': 'community_chats.user1_id' })
            .join('community_users AS users2', { 'users2.id': 'community_chats.user2_id' })
            .join('community_messages AS messages', { 'messages.chat_id': 'community_chats.id' })
            .join('community_posts as posts', { 'posts.id': 'community_chats.post_id' })
            .select(
                'community_chats.id',
                db.raw(`json_build_object('first_name', users1.first_name, 'id', users1.id) AS user1`),
                db.raw(`json_build_object('first_name', users2.first_name, 'id', users2.id) AS user2`),
                db.raw(`json_build_object('id', posts.id, 'user_id', posts.user_id, 'post_type', posts.post_type, 'description', posts.description, 'urgency', posts.urgency, 'date_created', posts.date_created) AS post`),
                db.raw(`json_agg(json_build_object('id', messages.id, 'sender_id', messages.sender_id, 'chat_id', messages.chat_id, 'message_content', messages.message_content, 'message_timestamp',messages.message_timestamp::timestamptz) ORDER BY message_timestamp) as messages`),
            )
            .where('community_chats.user1_id', '=', userId)
            .orWhere('community_chats.user2_id', '=', userId)
            .groupBy('community_chats.id', 'users1.id', 'users2.id', 'posts.id')
    },
    insertChat(db, newChat) {
        return db
            .insert(newChat)
            .into('community_chats')
            .returning('*')
            .then(([chat]) => chat)
            .then(chat => {
                return chat.id
            })
    },
    deleteChat(db, chatId) {
        return db
            .from('community_chats')
            .where({ id: parseInt(chatId) })
            .del()
    },
}

module.exports = ChatsService;