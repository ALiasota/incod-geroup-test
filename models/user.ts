import mongoose, { Model, model, Schema } from 'mongoose'

export enum UserRoles {
  ADMIN = 'ADMIN',
  BOSS = 'BOSS',
  USER = 'USER'
}

export interface IUser extends Document {
  name: string
  role: UserRoles
  password: string
  bossId?: mongoose.Schema.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
  _id?: mongoose.Schema.Types.ObjectId
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: UserRoles,
      required: true
    },
    bossId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      required: false
    },
    updatedAt: {
      type: Date,
      required: false
    }
  },
  { versionKey: false, timestamps: true }
)

const User: Model<IUser> = model('User', userSchema)

export default User
