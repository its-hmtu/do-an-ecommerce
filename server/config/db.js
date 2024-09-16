import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URI.replace('<db_username>', process.env.MONGO_DB_USER).replace('<db_password>', process.env.MONGO_DB_PASS))
    console.log(`MongoDB Connected: ${connect.connection.host}`)
  } catch(e) {
    console.error(`Error ${e.message}`)
    process.exit(1)
  }
}

export default connectDb;