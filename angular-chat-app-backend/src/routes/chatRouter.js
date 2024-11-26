const express = require('express')
const chatService = require('../services/chatService')

const chatRouter = express.Router()

//Endpoints:
chatRouter.get('', async (req, res) => {
    const userId = req.userId
    const chats = await chatService.getChatsByUserId(userId)
    res.json(chats)
})

chatRouter.post('', async (req, res) => {
    const { chatName, memberIds } = req.body
    const userId = req.userId
    const newChat = await chatService.createNewChat(chatName, userId, memberIds)
    res.json(newChat)
})

module.exports = chatRouter