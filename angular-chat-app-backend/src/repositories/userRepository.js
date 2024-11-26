const uuid = require('uuid').v4
const { query } = require('./databaseConfig')
const DatabaseError = require('../errors/DatabaseError')

async function exists(id) {
    const response = await query('select * from users where id = ?', id)
    if (response.length !== 1) { 
        return false 
    }
    return true
}

async function existsByUserName(userName) {
    const response = await query('select * from users where userName = ?', userName)
    if (response.length > 0) {
        return true
    }
    return false
}

async function existsByEmail(email) {
    const response = await query('select * from users where email = ?', email)
    if (response.length > 0) {
        return true
    }
    return false
}

async function getAll() {
    return await query('select * from users')
}

async function getById(id) {
    const result = await query('select * from users where id = ?', id)
    if (result.length !== 1) { 
        throw new DatabaseError(`Can not get user: No user with id ${id} exists.`) 
    }
    return result[0]
}


//TODO: Rewrite, so that the create will retry with new ids until it finds
//one that is actually unique (although it is really unlikely that this is
//neccessary, since uuid contains a timestamp)
async function create({ userName, email, passwordHash }) {
    const id = uuid()
    // this may throw, for example if a user with the same email or username already exists
    await query(
        'insert into users (id, userName, email, passwordHash) values (?, ?, ?, ?)', 
        [id, userName, email, passwordHash]
    )
    return { id, userName, email, passwordHash }
}

async function deleteById(id) {
    if (! await exists(id)) {
        throw new DatabaseError(`Can not delete user: No user with id ${id} exists`)
    }
    await query('delete from users where id = ?', id)
}

async function getByEmail(email) {
    const response = await query('select * from users where email = ?', email)
    if (response.length !== 1) { 
        throw new DatabaseError(`Can not get user: No user with email ${email} exists.`) 
    }
    const user = response[0]
    return { id: user.id , userName: user.userName, email: user.email, passwordHash: user.passwordHash }
}

async function getUsersOfChat(chatId) {
    const response = await query(
       `select users.* from users
        join memberOf on users.id = memberOf.userId
        join chats on chats.id = ?
            and memberOf.chatId = chats.id`,
        chatId
    )
    console.log('[Debugging] ' + response)
    return response
}

module.exports = { 
    exists,
    getAll,
    getById,
    create,
    deleteById,
    getByEmail,
    existsByUserName,
    existsByEmail,
    getUsersOfChat
}