import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.listen(process.env.PORT || 3000)
