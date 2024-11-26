const express = require('express')
const { checkUserDataForRegistration } = require('../validation/userValidation')
const userService = require('../services/userService')

const registrationRouter = express.Router()

registrationRouter.post('', async (req, res) => {
    const { email, userName, password } = req.body
    await checkUserDataForRegistration({ email, userName, password })
    const newUser = await userService.createNewUser({ email, userName, password })
    res.json(newUser)
})

module.exports = registrationRouter