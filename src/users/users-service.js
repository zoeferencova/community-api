const bcrypt = require('bcryptjs')
const xss = require('xss')
const knexPostgis = require('knex-postgis')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getUserInfo(db, userId) {
        const st = knexPostgis(db)
        return db
            .from('community_users AS user')
            .select(
                'user.id',
                'user.first_name',
                'user.email',
                'user.location AS location',
                db.raw(`ST_X(location::geometry) AS lng`),
                db.raw(`ST_Y(location::geometry) AS lat`),
                'user.radius'
            )
            .where('user.id', '=', userId)
            .first()
    },
    hasUserWithEmail(db, email) {
        return db('community_users')
            .where({ email })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('community_users')
            .returning('*')
            .then(([user]) => user)
    },
    updateUser(db, userId, newUserFields) {
        return db
            .from('community_users')
            .where({ id: userId })
            .update(newUserFields)
    },
    deleteUser(db, userId) {
        return db
            .from('community_users')
            .where({ id: Number(userId) })
            .del()
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            first_name: xss(user.first_name),
            email: xss(user.email),
            location: user.location,
            radius: user.radius
        }
    }
}

module.exports = UsersService;