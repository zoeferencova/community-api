const { io } = require('../app');
const { createChat, createMessage } = require('./factories');
const { USER_CONNECTED, USER_DISCONNECTED, COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING } = require('./events');

let connectedUsers = { }

let currentUser = { }

let communityChat = createChat();

module.exports = function(socket) {
    console.log(`Socket id: ${socket.id}`)

    let sendMessageToChatFromUser;
    let sendTypingFromUser;

    socket.on(USER_CONNECTED, user => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;
        currentUser = user;

        sendMessageToChatFromUser = sendMessageToChat(user)
        sendTypingFromUser = sendTypingToChat(user)

        io.emit(USER_CONNECTED, connectedUsers)
    })

    // NEED TO IMPLEMENT FRONT END DISCONNECT BUTTON FOR EACH CHAT
    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.id)
            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log(connectedUsers)
        }
    })

    // MAKE AN OPTION TO JOIN THE COMMUNITY CHAT INSTEAD E.G. BUTTON CLICK
    socket.on(COMMUNITY_CHAT, callback => {
        callback(communityChat)
    })

    socket.on(MESSAGE_SENT, ({ chatId, message }) => {
        sendMessageToChatFromUser(chatId, message)
    })

    socket.on(TYPING, ({ chatId, isTyping }) => {
        sendTypingFromUser(chatId, isTyping)
    })
}

function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        return io.emit(`${TYPING}-${chatId}`, { user, isTyping })
    }
}

function sendMessageToChat(sender) {
    return (chatId, message) => {
        io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }))
    }
}

function addUser(userList, user) {
    const formattedUser = { id: user.id, first_name: user.first_name }
    let newList = Object.assign({}, userList);
    newList[user.id] = formattedUser;
    return newList;
}

function removeUser(userList, userId) {
    let newList = Object.assign({}, userList);
    delete newList[userId];
    return newList;
}