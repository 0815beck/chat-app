const userRepository = require('../repositories/userRepository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const AuthenticationError = require('../errors/AuthenticationError')

dotenv.config()

//promisify some of the security functions
//exported functionality is defined below

const bcryptHash = (data, salt) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data, salt, (error, hash) => {
            if (error) { 
                console.error('[Error] in bcryptHash: ' + error.message)
                reject(error) 
            }
            else { 
                resolve(hash) 
            }
        })
    })
}

const bcryptCompare = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error) {
                console.error('[Error] in bcryptCompare: ' + error.message)
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

const jwtSign = (data, key) => {
    return new Promise((resolve, reject) => {
        jwt.sign(data, key, (error, token) => {
            if (error) {
                console.error('[Error] in jwtSign: ' + error.message)
                reject(error)
            } else {
                resolve(token)
            }
        })
    })
}

//exported functionality
const checkCredentialsAndReturnToken = async (email, password) => {
    const user = await userRepository.getByEmail(email)
    if (! await bcryptCompare(password, user.passwordHash)) {
        throw new AuthenticationError('Login failed: Password is wrong.')
    }
    const token = await jwtSign({ id: user.id }, process.env.JWT_SECRET)
    return token
}

async function createNewUser({ userName, email, password }) {
    const passwordHash = await bcryptHash(password, 10)
    return { id, userName, email } = await userRepository.create({ userName, email, passwordHash })
}

const exists = userRepository.exists
const deleteById = userRepository.deleteById
const getAll = userRepository.getAll
const getByEmail = userRepository.getByEmail
const getById = userRepository.getById


module.exports = { 
    exists, 
    createNewUser, 
    deleteById, 
    getAll, 
    getByEmail, 
    getById,
    checkCredentialsAndReturnToken
}