const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const authenticate = require('../auth/authenticate') 

dotenv.config()

const getToken = req => {
    //even though the web token is in a header called authorization,
    //it will be used for authentication on the server
    const authorization = req.header('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return undefined
}

const requireAuth = async (req, res, next) => {
    const token = getToken(req)
    //will throw when the token is invalid!
    const id = await authenticate(token)
    req.userId = id
    next()
}

module.exports = requireAuth