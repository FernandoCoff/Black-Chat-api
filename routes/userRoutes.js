import {
  checkAuth,
  createNewUser,
  loginUser,
  updateProfile,
} from '../controllers/user/index.js'
import { protectRoute } from '../middlewares/auth.js'
import { Router } from 'express'

const userRouter = Router()

// ROUTES
userRouter.post('/register', createNewUser)
userRouter.post('/sign-in', loginUser)
userRouter.put('/update-profile', protectRoute, updateProfile)
userRouter.get('/check-auth', protectRoute, checkAuth)

export default userRouter
