import { Schema, Model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlenght: 3,
    },
    password: {
      type: String,
      required: true,
      minlenght: 6,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

const User = new Model('User', UserSchema)
export default User
