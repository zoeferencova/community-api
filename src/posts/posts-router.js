const express = require('express');
const AuthService = require('../auth/auth-service');
const PostsService = require('./posts-service');

const postsRouter = express.Router();
const jsonBodyParser = express.json();

postsRouter
    .route('/')
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        PostsService.getUserPosts(req.app.get('db'), userId)
            .then(posts => {
                return res.json(posts)
            })
    })

module.exports = postsRouter;


