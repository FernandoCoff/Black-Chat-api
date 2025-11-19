import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './database/index.js'
import userRouter from '../routes/userRoutes.js'


// CONNECT DATABASE
connectDB()

// APP + MIDDLEWARES
const app = express()
app.use(cors())
app.use(express.json())

// ROUTES
app.get('/api/status', (req, res) => {
  res.status(200).send({ msg: 'SERVER IS RUNNING!' })
})
app.use('/api/auth', userRouter)

// LISTEN AND EXPORT APP
app.listen(process.env.PORT || 3000, () => 'SERVER IS RUNNING!')
export default app
