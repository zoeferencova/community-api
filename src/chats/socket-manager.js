const { io } = require('../app');
const { createMessage } = require('./factories');
const { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, CHAT_STARTED, MESSAGE_SENT, CHAT_DELETED, CHAT_TO_REMOVE, TYPING, PRIVATE_MESSAGE, NEW_CHAT } = require('./events');

let connectedUsers = { }

module.exports = function(socket) {
    console.log(`Socket id: ${socket.id}`)
    console.log(connectedUsers)

    let sendTypingFromUser;

    socket.on(USER_CONNECTED, user => {
        user.socketId = socket.id;
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        sendTypingFromUser = sendTypingToChat(user)
        console.log('connected test: ', connectedUsers)

        io.emit(USER_CONNECTED, connectedUsers)
    })

    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.id)
            io.emit(USER_DISCONNECTED, connectedUsers)
        }
    })

    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.id)
        io.emit(USER_DISCONNECTED, connectedUsers)
    })

    socket.on(MESSAGE_SENT, ({ sender, receiverId, message }) => {
        const formattedMessage = createMessage({ message, sender })
        if (receiverId in connectedUsers) {
            const receiverSocket = connectedUsers[receiverId].socket_id
            socket.to(receiverSocket).emit(PRIVATE_MESSAGE, formattedMessage)
        }
    })

    socket.on(CHAT_STARTED, ({ receiverId, chat }) => {
        if (receiverId in connectedUsers) {
            const receiverSocket = connectedUsers[receiverId].socket_id
            socket.to(receiverSocket).emit(NEW_CHAT, chat)
        }
    })

    socket.on(CHAT_DELETED, ({ chatId, receiverId }) => {
        if (receiverId in connectedUsers) {
            const receiverSocket = connectedUsers[receiverId].socket_id
            socket.to(receiverSocket).emit(CHAT_TO_REMOVE, chatId)
        }
    })

    socket.on(TYPING, ({ chatId, isTyping }) => {
        sendTypingFromUser(chatId, isTyping)
    })
}

function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, { user, isTyping })
    }
}

function addUser(userList, user) {
    const formattedUser = { id: user.id, first_name: user.first_name, socket_id: user.socketId }
    let newList = Object.assign({}, userList);
    newList[user.id] = formattedUser;
    return newList;
}

function removeUser(userList, userId) {
    let newList = Object.assign({}, userList);
    delete newList[userId];
    return newList;
}