const express = require('express');
const MessagesService = require('./messages-service');
const AuthService = require('../auth/auth-service');
const ChatsService = require('../chats/chats-service');
const { requireAuth } = require('../middleware/jwt-auth');

const messagesRouter = express.Router();
const jsonBodyParser = express.json();

messagesRouter
    .route('/')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const sender_id = AuthService.getUserId(req.get('Authorization'));
        const { chat_id, message_content } = req.body;
        const newMessage = {
            sender_id: sender_id,
            chat_id: chat_id,
            message_content: message_content
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

        ChatsService.getNewChatById(req.app.get('db'), chat_id)
            .then(chat => {
                if (!chat) {
                    return res.status(400).json({
                        error: {
                            message: `There is no chat with an id of ${chat_id}`
                        }
                    })
                }

                if (parseInt(chat.user1.id) !== parseInt(sender_id) && parseInt(chat.user2.id) !== parseInt(sender_id)) {
                    return res.status(400).json({
                        error: {
                            message: `Current user is not part of the chat with the id of ${chat_id}`
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


