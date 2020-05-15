const express = require('express');
const AuthService = require('../auth/auth-service');
const UsersService = require('../users/users-service');
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

postsRouter
    .route('/neighborhood-posts')
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                PostsService.getNeighborhoodPosts(req.app.get('db'), user)
                    .then(posts => {
                        console.log(posts)
                        return res.json(posts)
                    })
            })
        
    })

module.exports = postsRouter;


