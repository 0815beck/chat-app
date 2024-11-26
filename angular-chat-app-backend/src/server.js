const express = require('express')
const cors = require('cors')
const http = require('http')
require('express-async-errors')
const loginRouter = require('./routes/loginRouter')
const registrationRouter = require('./routes/registrationRouter')
const chatRouter = require('./routes/chatRouter')
const errorHandler = require('./middlewear/errorHandler')
const configureSocketIo = require('./socket/configureIO')
const requireAuth = require('./middlewear/requireAuth')

const PORT = process.env.PORT || 3000

const router = express()

//global middlewear
router.use(cors())
router.use(express.json())

//authentication
router.use('/api/chats', requireAuth)

//routes
router.use('/login', loginRouter)
router.use('/register', registrationRouter)
router.use('/api/chats', chatRouter)


//error handling
router.use(errorHandler)

//attaching socket io
const server = http.createServer(router)
const io = require('socket.io')(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      transports: ['websocket'] 
    }
  });
configureSocketIo(io)

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`)
})
