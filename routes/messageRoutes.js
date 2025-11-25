import {
  getAllUsers,
  getMessages,
  markAsSeen,
  sendMessage,
} from '../controllers/message/index.js'
import { protectRoute } from '../middlewares/auth.js'
import { Router } from 'express'

const messageRouter = Router()

// ROUTES
messageRouter.get('/users', protectRoute, getAllUsers)
messageRouter.get('/:id', protectRoute, getMessages)
messageRouter.put('mark-as-seen/:id', protectRoute, markAsSeen)
messageRouter.post('/send/:id', protectRoute, sendMessage)

export default messageRouter
