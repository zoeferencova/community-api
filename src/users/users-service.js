const bcrypt = require('bcryptjs')
const xss = require('xss')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getUserInfo(db, userId) {
        return db
            .from('community_users AS user')
            .select(
                'user.first_name',
                'user.email',
                'user.location_lat',
                'user.location_lng',
                'user.location_radius'
            )
            .where('user.user_id', '=', userId)
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
            user_id: user.user_id,
            first_name: xss(user.first_name),
            email: xss(user.email),
            location_lat: xss(user.location_lat),
            location_lng: xss(user.location_lng),
            location_radius: xss(user.location_radius)
        }
    }
}

module.exports = UsersService;