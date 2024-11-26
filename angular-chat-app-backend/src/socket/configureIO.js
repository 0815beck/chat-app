const chatService = require('../services/chatService')
const isAuthorized = require('../auth/authorization')
const authenticate = require('../auth/authenticate')

let connectCounter = 0;

function configureSocketIo(io) {
    //authentication on connection!
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log('[Error] Failed to connect sockets: No token.')
            next(new Error('You need to provide a token.'))
            return
        }
        let userId
        try {
            userId = await authenticate(token)
        } catch (error) {
            console.log('[Error] Failed to authenticate: Token invalid.', error)
            next(new Error('Your token is invalid.'))
            return
        }
        socket.userId = userId
        console.log('[Info] Socket connection request has been autheticated.')
        next()
    })

    io.on('connection', (socket) => {
    
        connectCounter++
        console.log('[Info] A new socket has been connected.')
        console.log('[Info] # Connected sockets: ' + connectCounter)

        socket.on('disconnect', () => {
            connectCounter--;
            console.log('[Info] A socket has been disconnected.')
            console.log('[Info] # Connected sockets: ' + connectCounter)
        })

        socket.on('join', async (chatId) => {
            if (! await isAuthorized(socket.userId, chatId)) {
                socket.emit('error', {status: 401, error: 'You are unauthorized to access this chat.'})
                return
            }
            socket.join(chatId)
            const messages = await chatService.getMessages(chatId)
            //messages.push({
            //    id: 1,
            //    chatId,
            //    userId: socket.userId,
            //    content: 'Hello World!'
            //})
            console.log('[Debug] Event join was triggered. Messages: ', messages)
            socket.emit('joined', messages)
        })

        socket.on('new message', async (chatId, message) => {
            console.log('[Info] Event new message was triggered. Content: ' + message.content)
            if (! await isAuthorized(socket.userId, chatId)) {
                socket.emit('error', {status: 401, error: 'You are unauthorized to access this chat.'})
                return
            }
            try {
                await chatService.saveMessage(message)
            } catch (error) {
                console.log('[Error] An error occured. Unable to save the new message to the database')
                socket.emit('error', {status: 500, error: 'Unable to save message to database.'})
                return
            }
            console.log('[Debug] The message was successfully send. Next broadcase a new '
                + 'message event to the chat room'
            )
            io.to(chatId).emit('new message', message)
        })
    })

}

module.exports = configureSocketIo