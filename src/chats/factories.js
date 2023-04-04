const createMessage = ({ message, sender }) => {
    return {
        id: message.id,
        message_timestamp: new Date(Date.now()),
        message_content: message.message_content,
        sender_id: sender.id,
        chat_id: message.chat_id
    }
}

module.exports = {
    createMessage,
}

