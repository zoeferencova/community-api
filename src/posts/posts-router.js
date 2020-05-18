const express = require('express');
const AuthService = require('../auth/auth-service');
const UsersService = require('../users/users-service');
const PostsService = require('./posts-service');
const CategoryPostService = require('../category-post/category-post-service');

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

    .post(jsonBodyParser, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        const { post_type, category_ids } = req.body;
        const newPost = { post_type, category_ids };
        newPost.user_id = userId;

        for (const [key, value] of Object.entries(newPost)) {
            if (value === '' || value === undefined) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        newPost.description = req.body.description;
        newPost.urgency = req.body.urgency;

        const catIdArray = CategoryPostService.makeObjectArray(newPost.category_ids)

        delete newPost.category_ids;

        PostsService.insertPost(
            req.app.get('db'),
            newPost,
            catIdArray
        )
            .then(post => {
                res
                    .status(201)
                    .json(post)
            })
            .catch(next)
    })

postsRouter
    .route('/neighborhood-posts')
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                PostsService.getNeighborhoodPosts(req.app.get('db'), user)
                    .then(posts => {
                        return res.json(posts)
                    })
            })
        
    })

postsRouter
    .route('/:id')
    .all((req, res, next) => {
        PostsService.getPostById(
            req.app.get('db'),
            req.params.id,
        )
            .then(post => {
                if (!post) {
                    return res.status(404).json({
                        error: { message: `Post doesn't exist` }
                    })
                }
                res.post = post;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const id = req.params.id;
        PostsService.getPostById(req.app.get('db'), id)
            .then(post => {
                return res.json(post)
            })
            .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const postToUpdate = req.body;
        const possibleValues = ['description', 'urgency', 'category_ids']
    
        const irrelevantValues = Object.keys(postToUpdate).filter(key => !possibleValues.includes(key))

        irrelevantValues.forEach(value => {
            delete postToUpdate[value]
        })

        const numberOfRelevantValues = Object.values(postToUpdate).filter(Boolean).length;

        const updatePost = () =>  {
            delete postToUpdate.category_ids;

            PostsService.updatePost(
                req.app.get('db'),
                req.params.id,
                postToUpdate,
            )
            .then(numberOfRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
        }

        // Delete old associations and insert new ones
        const updateCategoryPostAssoc = () => {
            const catIdArray = CategoryPostService.makeObjectArray(postToUpdate.category_ids);

            CategoryPostService.deleteAssoc(
                req.app.get('db'),
                req.params.id,
            )
                .then(assoc => {
                    CategoryPostService.insertAssoc(
                        req.app.get('db'),
                        req.params.id,
                        catIdArray
                    )
                        .then(id => {
                            res.status(204).end()
                        })
                })
                .catch(next)
        }

        // Return error if no update values are present
        if (numberOfRelevantValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'category_ids', 'description' or 'urgency'.`
                }
            })
        }

        // Return error if category_ids are present in request but the array is empty
        if (postToUpdate.category_ids && postToUpdate.category_ids.length === 0) {
            return res.status(400).json({
                error: {
                    message: `'category_ids' must include at least one value.`
                }
            })
        }

        // If update object does not contain category_ids
        if (!postToUpdate.category_ids) {
            updatePost()

        // If update object contains only category_ids
        } else if (numberOfRelevantValues === 1 && postToUpdate.category_ids) {
            updateCategoryPostAssoc()
        
        // If update object contains category_ids and other item(s)
        } else if (numberOfRelevantValues > 1 && postToUpdate.category_ids) {
            updateCategoryPostAssoc()
            updatePost()
        } 
    })
    .delete((req, res, next) => {
        const postId = req.params.id;
        PostsService.deletePost(req.app.get('db'), postId)
           .then(id => {
               res.status(204).end()
           })
           .catch(next)
    })

module.exports = postsRouter;


