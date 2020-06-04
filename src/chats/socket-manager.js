const { io } = require('../app');
const { createMessage } = require('./factories');
const { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE } = require('./events');

let connectedUsers = { }

module.exports = function(socket) {
    console.log(`Socket id: ${socket.id}`)

    let sendTypingFromUser;

    socket.on(USER_CONNECTED, user => {
        user.socketId = socket.id;
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        sendTypingFromUser = sendTypingToChat(user)

        io.emit(USER_CONNECTED, connectedUsers)
    })

    socket.on('disconnect', () => {
        if ("user" in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.id)
            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log(connectedUsers)
        }
    })

    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.id)
        io.emit(USER_DISCONNECTED, connectedUsers)
        console.log('disconnect', connectedUsers)
    })

    socket.on(MESSAGE_SENT, ({ sender, receiver, message }) => {
        const formattedMessage = createMessage({ message, sender })
        if (receiver.id in connectedUsers) {
            const receiverSocket = connectedUsers[receiver.id].socket_id
            socket.to(receiverSocket).emit(PRIVATE_MESSAGE, formattedMessage)
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