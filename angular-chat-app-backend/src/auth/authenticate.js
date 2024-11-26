const AuthenticationError = require('../errors/AuthenticationError')
const jwt = require('jsonwebtoken')
const userService = require('../services/userService')

const jwtVerify = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                console.error('[Error] in jwtVerify: ' + error.message)
                reject(error)
            } else {
                resolve(decoded)
            }
        })
    })
}

async function authenticate(token) {
    console.log('[Debug] Trying to authenticate. Token: ' + token)
    if (!token) {
        throw new AuthenticationError('Could not authenticate: ' +
            'Request does not contain an "Authorization: Bearer <token>" header')
    }
    let decoded 
    try {
        decoded = await jwtVerify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new AuthenticationError('Could not authenticate: ' + 
            'The token seems to be invalid.'
        )
    }
    const id = decoded.id
    if (!userService.exists(id)) {
        throw new AuthenticationError('Could not authenticate: ' + 
            'User does not exist.'
        )
    }
    console.log('[Debug] Successfull authetication. User id: ' + id)
    return id
}

module.exports = authenticate