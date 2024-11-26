const userRepository = require('../repositories/userRepository')
const chatRepository = require('../repositories/chatRepository')
const messageRepository = require('../repositories/messageRepository')
const DatabaseError = require('../errors/DatabaseError')
const { validateNewChatData } = require('../validation/chatValidation')

async function getChatsByUserId(userId) {
    let chats = await chatRepository.getChatsByUserId(userId)
    return chats
}

async function createNewChat(chatName, userId, memberIds) {
    await validateNewChatData(chatName, userId, memberIds)
    const newChat = await chatRepository.createNewChat(chatName, memberIds)
    return newChat
}

const getMessages = chatRepository.getMessages
const getChat = chatRepository.getChat
const saveMessage = messageRepository.saveMessage

module.exports = {
    getMessages,
    createNewChat,
    getChatsByUserId,
    getChat,
    saveMessage
}
