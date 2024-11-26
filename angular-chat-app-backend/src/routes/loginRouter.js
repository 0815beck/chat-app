const express = require('express')
const userService = require('../services/userService')
const AuthenticationError = require('../errors/AuthenticationError')

const loginRouter = express.Router()

loginRouter.post('', async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        throw new AuthenticationError('Can not log in: ' + 
            'Email is missing.'
        )
    }
    if (!password) {
        throw new AuthenticationError('Can not log in: ' + 
            'Password is missing.'
        )
    }
    const token = await userService.checkCredentialsAndReturnToken(email, password)
    const { id, userName } = await userService.getByEmail(email)
    res.json({ token, id, userName, email })
})

module.exports = loginRouter

