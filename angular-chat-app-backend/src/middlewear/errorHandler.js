const AuthenticationError = require('../errors/AuthenticationError')
const DatabaseError = require('../errors/DatabaseError')
const AuthorizationError = require('../errors/AuthorizationError')
const ValidationError = require('../errors/ValidationError')

const errorHandler = (error, _, res, next) => {
    if (error instanceof AuthenticationError ||
        error instanceof DatabaseError ||
        error instanceof  AuthorizationError ||
        error instanceof ValidationError
    ) {
        res.status(error.status)
        res.json(error)
    } else {
        next(error)
    }
}

module.exports = errorHandler
