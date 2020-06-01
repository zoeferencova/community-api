const express = require('express');
const MessagesService = require('./messages-service');
const AuthService = require('../auth/auth-service');
const ChatsService = require('../chats/chats-service');

const messagesRouter = express.Router();
const jsonBodyParser = express.json();

messagesRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const senderId = AuthService.getUserId(req.get('Authorization'));
        const { chatId, message } = req.body;
        const newMessage = { 
            sender_id: parseInt(senderId), 
            chat_id: parseInt(chatId),
            message_content: message
        };

        for (const [key, value] of Object.entries(newMessage)) {
            if (value === '' || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        ChatsService.getChatById(req.app.get('db'), chatId)
            .then(chat => {
                if (!chat) {
                    return res.status(400).json({
                        error: {
                            message: `There is no chat with an id of ${chatId}`
                        }
                    })
                }
        
                if (parseInt(chat.user1.id) !== parseInt(senderId) && parseInt(chat.user2.id) !== parseInt(senderId)) {
                    return res.status(400).json({
                        error: {
                            message: `Current user is not part of the chat with the id of ${chatId}`
                        }
                    })
                }

                MessagesService.insertMessage(
                    req.app.get('db'),
                    newMessage
                )
                    .then(message => {
                        res
                            .status(201)
                            .json(message)
                    })
                    .catch(next)
            })
    })

module.exports = messagesRouter;


