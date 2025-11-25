import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { Server } from 'socket.io'
import connectDB from './database/index.js'
import userRouter from '../routes/userRoutes.js'
import messageRouter from '../routes/messageRoutes.js'

// CONNECT DATABASE
connectDB()

// APP + MIDDLEWARES
const app = express()
app.use(cors())
app.use(express.json())

// SOCKET.IO APP
export const io = new Server(app, {
  cors: { origin: '*' },
})

// STORE ONLINE USERS
export const userSocketMap = {}

// SOCKET.OI CONNECTION HANDLER
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId
  console.log('USER CONNECTED!', userId)

  if (userId) {
    userSocketMap[userId] = socket.id
  }

  // EMIT ONLINE USERS TO ALL CONNECTED CLIENT
  io.emit('get-online-users', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED!', userId)
    delete userSocketMap[userId]
    io.emit('get-online-users', Object.keys(userSocketMap))
  })
})

// ROUTES
app.get('/api/status', (req, res) => {
  res.status(200).send({ success: true, message: 'Server is running!' })
})
app.use('/api/auth', userRouter)
app.use('/api/messages', messageRouter)

// LISTEN AND EXPORT APP
app.listen(process.env.PORT || 3000, () => 'SERVER IS RUNNING!')
export default app
