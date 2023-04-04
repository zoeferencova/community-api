const express = require('express');
const AuthService = require('./auth-service');
const UsersService = require('../users/users-service');
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router();
const jsonBodyParser = express.json();

const sanitizeResponse = post => ({
    id: post.id,
    post_type: xss(post.post_type),
    description: post.description !== null ? xss(post.description) : post.description,
    urgency: post.urgency !== null ? xss(post.urgency) : post.urgency,
    date_created: post.date_created,
    location: post.location,
    radius: post.radius,
    first_name: xss(post.first_name),
    categories: post.categories,
    distance_from_user: post.distance_from_user
})

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { email, password } = req.body;
        const loginUser = { email, password };

        for (const [key, value] of Object.entries(loginUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        AuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(400).json({ error: `Incorrect email or password` })
                }
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        if (!compareMatch) {
                            return res.status(400).json({
                                error: `Incorrect email or password`
                            })
                        }

                        const sub = dbUser.email;
                        const payload = { user_id: dbUser.id };

                        res.send({
                            authToken: AuthService.createJwt(sub, payload),
                            user: dbUser
                        })
                    }).catch(next)
            })

            .catch(next)
    })

authRouter
    .route('/confirm-password')
    .all(requireAuth)
    .post(jsonBodyParser, (req, res, next) => {
        const { password } = req.body;
        const userId = AuthService.getUserId(req.get('Authorization'));
        UsersService.getUserInfo(req.app.get('db'), userId)
            .then(user => {
                AuthService.getUserWithEmail(req.app.get('db'), user.email)
                    .then(dbUser => {
                        AuthService.comparePasswords(password, dbUser.password)
                            .then(compareMatch => {
                                if (!compareMatch) {
                                    return res.status(400).json({
                                        error: `Incorrect old password`
                                    })
                                } else {
                                    return res.send('correct')
                                }

                            })
                    }).catch(next)

            }).catch(next)
    })

authRouter
    .route('/update-jwt')
    .post(jsonBodyParser, (req, res, next) => {
        const { email, userId } = req.body;
        const sub = email;
        const payload = { user_id: userId };

        return res.send({
            authToken: AuthService.createJwt(sub, payload),
        })
    })

module.exports = authRouter;