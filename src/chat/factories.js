const { uuid } = require("uuidv4");

const createMessage = ({ message="", sender } = {}) => {    
    return {
        id: uuid(),
        timestamp: getTime(new Date(Date.now())),
        message,
        sender: {
            first_name: sender.first_name,
            id: sender.id
        }
    }
}

const createChat = ({ messages=[], name="Community", users=[] } = {}) => {
   return {
       id: uuid(),
       name,
       messages,
       users,
       typingUsers: []
   } 
}

const getTime = date => {
    return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`
}

module.exports = {
    createMessage,
    createChat
}
    
 