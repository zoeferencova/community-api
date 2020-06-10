require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const knexPostgis = require('knex-postgis');
const { PORT, DATABASE_URL, NODE_ENV } = require('./config');

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const postsRouter = require('./posts/posts-router');
const chatsRouter = require('./chats/chats-router');
const messagesRouter = require('./messages/messages-router');

// App and server setup
const app = express();
const server = require('http').Server(app);

// Middleware setup
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.options('*', cors())

// Router setup
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/messages', messagesRouter);

// Knex and Knex Postgis setup
const db = knex({ client: 'pg', connection: DATABASE_URL });
knexPostgis(db);
app.set('db', db);

// Socket.io setup
const io = module.exports.io = require('socket.io')(server);
const SocketManager = require('./chats/socket-manager');
io.on('connection', SocketManager);

// Error handler middleware
app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

module.exports = app;