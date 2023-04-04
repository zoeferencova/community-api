const MessagesService = {
    insertMessage(db, newMessage) {
        return db
            .insert(newMessage)
            .into('community_messages')
            .returning(db.raw(`id, chat_id, sender_id, message_content, message_timestamp::timestamptz`))
            .then(([message]) => message)
    },
}

module.exports = MessagesService;