# CommUnity API

Live app: https://comm-unity.now.sh/

## Summary

Right now, more than ever, we need to unite our communities and help those in need. CommUnity is a platform that enables the sharing of services and resources to ensure no one is left stranded during the Coronavirus (COVID-19) outbreak.

Living in Woodside, Queens, one of the epicenters of the pandemic in the US, I have experienced the immense impact of the virus first hand. While it is heartbreaking to see the damage and loss that has been caused, it has been great to see my community come together to support each other. I started to see a lot of hand written signs around my apartment building and on the streets offering help to those who are in high risk categories. This inspired me to create an app that simplifies the process of getting in touch with neighbors to offer a hand or request help.

Users can post offers to help or requests for help across a number of categories such as picking up supplies, dog walking, running errands, or a friendly chat. Each user sets their location and radius and can view and respond to posts from other users in their area. This initiates a private chat where the users can work out the details.

## API Documentation

### Authentication Endpoint

Endpoints used for Authentication on user login and old password confirmation for password change.

* [Login](docs/auth/login.md) : `POST /api/auth/login`
* [Confirm Password](docs/auth/confirm-password.md) : `POST /api/auth/confirm-password`

### User Information Endpoints

Endpoints related to user information associated with the User whose Token is provided with the request:

* [Get User Info](docs/user/get.md) : `GET /api/users`
* [Create User](docs/user/post.md) : `POST /api/users`
* [Update User Info by ID](docs/user/id/patch.md) : `PATCH /api/users/:id`
* [Delete User by ID](docs/user/id/delete.md) : `DELETE /api/users/:id`

### Post Endpoints

Endpoints used to view and manipulate post data associated with the User whose Token is provided with the request:

* [Get User's Posts](docs/posts/get.md) : `GET /api/posts`
* [Get Neighborhood Posts](docs/posts/get-neighborhood.md) : `GET /api/posts/neighborhood-posts`
* [Create Post](docs/posts/post.md) : `POST /api/posts`
* [Get Post by ID](docs/posts/id/get.md) : `GET /api/posts/:id`
* [Update Post by ID](docs/posts/id/patch.md) : `PATCH /api/posts/:id`
* [Delete Post by ID](docs/posts/id/delete.md) : `DELETE /api/posts/:id`

### Chat Endpoints

Endpoints used to view and manipulate chat data associated with the User whose Token is provided with the request:

* [Get User's Chats](docs/chats/get.md) : `GET /api/chats`
* [Create Chat](docs/chats/post.md) : `POST /api/chats`
* [Get Chat by ID](docs/chats/id/get.md): `GET /api/chats/:id`
* [Delete Chat By ID](docs/chats/id/delete.md): `DELETE /api/chats/:id`

### Message Endpoints

Endpoints used to create a new message written by the User whose Token is provided with the request:

* [Create Message](docs/messages/post.md) : `POST /api/messages`

## Technologies Used

* Node.js with Express
* PostgreSQL with Knex
* Socket.io for live chat web sockets
* PostGIS for server side geolocation services
* JWT for authentication
* Mocha for backend testing

## Demo Account

To access the demo account, click on the "See a demo" button on the landing page. You will be automatically logged in as a demo user and able to use the app as a regular user.

## Frontend

The frontend repository for the app using this API can be found [here](https://github.com/zoeferencova/community-frontend).
