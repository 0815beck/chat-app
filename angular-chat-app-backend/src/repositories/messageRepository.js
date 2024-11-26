const uuid = require('uuid').v4
const { query } = require('./databaseConfig')
const DatabaseError = require('../errors/DatabaseError')


async function saveMessage(message) {
    const id = uuid()
    try {
        await query(
            `insert into messages (id, time, content, userId, chatId)
            values (?, ?, ?, ?, ?)`,
            [id, message.time, message.content, message.userId, message.chatId]
        )
    } catch (error) {
        throw new DatabaseError('Could not save the new message to the database.')
    }
}

module.exports = { saveMessage }