const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service');
const PostsService = require('../posts/posts-service');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                PostsService.fixLocationAndRadius(user)
                return res.json(user)
            })
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { password, email, first_name } = req.body;

        for(const field of ['first_name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = UsersService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
        .then(hasUserWithEmail => {
            if (hasUserWithEmail) {
                return res.status(400).json({ error: `Email already taken` })
            }
        
            return UsersService.hashPassword(password)
              .then(hashedPassword => {
                  const newUser = {
                    email,
                    password: hashedPassword,
                    first_name,
                  }
        
                  return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                  )
                    .then(user => {
                      res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user))
                    })
                })
        })
        .catch(next)
    })

usersRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        const userId = req.params.id;
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User doesn't exist` }
                    })
                }
                res.user = user;
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const userId = AuthService.getUserId(req.get('Authorization'));
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                PostsService.fixLocationAndRadius(user)
                return res.json(user)
            })
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { first_name, email, password, location, radius } = req.body;
        const itemToUpdate = { first_name, email, password, location, radius }

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'first_name', 'email', 'password', location' or 'radius'.`
                }
            })
        }

        if (itemToUpdate.password !== undefined) {
            const passwordError = UsersService.validatePassword(password)

            if (passwordError) {
                return res.status(400).json({ error: passwordError })
            }

            UsersService.hashPassword(password)
                .then(hashedPassword => {
                    updatePassword = { password: hashedPassword }

                    UsersService.updateUser(
                        req.app.get('db'),
                        req.params.id,
                        updatePassword
                    )
                        .then(numRowsAffected => {
                            res.status(204).end()
                        })
                        .catch(next)
                })   
        } else {
            UsersService.updateUser(
                req.app.get('db'),
                req.params.id,
                itemToUpdate
            )
                .then(res => {
                    if (itemToUpdate.email !== undefined ) {
                        const sub = itemToUpdate.email;
                        const payload = { user_id: req.params.id };
                        let user;
                        UsersService.getUserInfo(req.app.get('db'), userId)
                            .then(user => {
                                PostsService.fixLocationAndRadius(user)
                                user = res.json(user)
                            })
                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                            user
                        })
                    } 
                })
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(response => {
                    res.status(400).json({ error: "Email address is taken" })
                })
        }
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        UsersService.deleteUser(req.app.get('db'), id)
            .then(id => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = usersRouter;