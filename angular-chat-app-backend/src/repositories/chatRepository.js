const { query } = require('./databaseConfig')
const uuid = require('uuid').v4
const userRepository = require('../repositories/userRepository')
const DatabaseError = require('../errors/DatabaseError')

async function getChatsByUserId(userId) {
    const chats = await query(
        `select chats.* 
         from chats, memberOf, users
         where memberOf.chatId = chats.id
            and users.id = memberOf.userId
            and users.id = ?`,
        userId
    )
    for(let chat of chats) {
        const members = await query(
           `select users.id, users.userName, users.email
            from users, memberOf
            where users.id = memberOf.userId and memberOf.chatId = ?`,
            chat.id
        )
        chat.members = members
    }
    return chats
}

async function createNewChat(chatName, userIds) {
    const chatId = uuid()
    await query(
       `insert into chats (id, chatName)
        values (?, ?)`,
        [id, chatName]
    )
    let members = []
    for (const userId of userIds) {
        await query(
            `insert into memberOf (userId, chatId)
            values (?, ?)`,
            [userId, chatId]
        )
        const user = await userRepository.getById(userId)
        members.push({ userName: user.userName, userId: user.userId })
    }
    return { id, chatName, members }
}

async function getMessages(chatId) {
    const response = await query(
        `select messages.* from messages, chats 
        where chats.id = ?
        and chats.id = messages.chatId
        order by messages.time`, 
        chatId
    )
    return response
}

async function getChat(chatId) {
    const response = await query('select * from chats where chats.id = ?', chatId)
    if (!response.length === 1) {
        throw new DatabaseError('Can not get chat: ' +
            'Chat with id ' + chatId + ' does not exist in the database.'
        )
    }
    let chat = response[0]
    const members = await query(
        `select users.id, users.userName, users.email
        from users, memberOf
        where users.id = memberOf.userId and memberOf.chatId = ?`,
        chatId
    )
    chat.members = members
    return chat
}


module.exports = { getChatsByUserId, createNewChat, getMessages, getChat }