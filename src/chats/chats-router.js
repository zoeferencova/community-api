const express = require('express');
const ChatsService = require('./chats-service');
const AuthService = require('../auth/auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const chatsRouter = express.Router();
const jsonBodyParser = express.json();

chatsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        ChatsService.getUserChats(req.app.get('db'), userId)
            .then(chats => {
                return res.json(chats)
            })
    })

    .post(jsonBodyParser, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        const { user2Id, postId } = req.body;

        const requiredValues = { user2Id, postId };

        for (const [key, value] of Object.entries(requiredValues)) {
            if (value === '' || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        const newChat = { user1_id: parseInt(userId), user2_id: parseInt(user2Id), post_id: parseInt(postId) };

        ChatsService.insertChat(
            req.app.get('db'),
            newChat
        )
            .then(chatId => {
                ChatsService.getNewChatById(req.app.get('db'), chatId)
                    .then(chat => {
                        return res.status(201).json(chat)
                    })
                    .catch(next)
            })
            .catch(next)
    })

chatsRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        ChatsService.getNewChatById(
            req.app.get('db'),
            req.params.id,
        )
            .then(chat => {
                if (!chat) {
                    return res.status(404).json({
                        error: { message: `Chat doesn't exist` }
                    })
                }
                res.chat = chat
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const chatId = req.params.id;
        ChatsService.getNewChatById(req.app.get('db'), chatId)
            .then(chat => {
                return res.json(chat)
            })
    })
    .delete((req, res, next) => {
        const chatId = req.params.id;
        ChatsService.deleteChat(req.app.get('db'), chatId)
           .then(id => {
               res.status(204).end()
           })
           .catch(next)
    })

module.exports = chatsRouter;


