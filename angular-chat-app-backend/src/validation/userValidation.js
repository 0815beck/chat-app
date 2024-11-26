const userRepository = require('../repositories/userRepository')
const userService = require('../services/userService')
const ValidationError = require('../errors/ValidationError')

const checkUserDataForRegistration = async ({ email, userName, password }) => {
    if (await userRepository.existsByEmail(email)) {
        throw new ValidationError(422, 'Can not register: ' +
            'E-Mail already exists.'
        )
    }

    if (await userRepository.existsByUserName(userName)) {
        throw new ValidationError(422, 'Can not register: ' + 
            'Username already exists.'
        )
    }

    if (!password) {
        throw new ValidationError(422, 'Can not register: ' + 
            'You need to specify a password.'
        )
    }

    if(password.length < 5) {
        throw new ValidationError(422, 'Can not register: ' + 
            'Your password has to be at least 5 characters long'
        )
    }  

    if(userName.trim().length === 0) {
        throw new ValidationError(422, 'Can not register: ' + 
            'Your username must contain characters other than whitespace.'
        )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new ValidationError(422, 'Can not register: ' + 
            'You need to enter a valid email address'
        )
    }
}

module.exports = { checkUserDataForRegistration }