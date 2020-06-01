const MessagesService = {
    insertMessage(db, newMessage) {
        return db
            .insert(newMessage)
            .into('community_messages')
            .returning('*')
            .then(([message]) => message)      
    },
}

module.exports = MessagesService;