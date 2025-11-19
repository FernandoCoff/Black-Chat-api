import { connect } from 'mongoose'

const connectDB = async () => {
  try {
    await connect(process.env.DB_KEY)
    console.log('DB CONNECTED!')
  } catch (error) {
    console.error(`CONNECT DB ERROR: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
