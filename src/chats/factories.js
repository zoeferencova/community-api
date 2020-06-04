const { uuid } = require("uuidv4");

const createMessage = ({ message, sender }) => {    
    return {
        id: message.id,
        message_timestamp: new Date(Date.now()),
        message_content: message.message_content,
        sender_id: sender.id,
        chat_id: message.chat_id
    }
}

// const createChat = ({ messages=[], name="Community", users=[] } = {}) => {
//    return {
//        id: uuid(),
//        name,
//        messages,
//        users,
//        typingUsers: []
//    } 
// }

const getTime = date => {
    return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`
}

module.exports = {
    createMessage,
    // createChat
}
    
 