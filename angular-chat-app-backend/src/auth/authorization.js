const chatService = require('../services/chatService')

//checks if the user is a member of the chat they won't access to
async function isAuthorized(userId, chatId) {
    const chat = await chatService.getChat(chatId)
    const user = chat.members.find(member => member.id === userId)
    if (!user) {
        return false
    }
    return true
}

module.exports = isAuthorized