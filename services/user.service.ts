import jwt from 'jsonwebtoken'
import User, { IUser, UserRoles } from '../models/user'
import mongoose from 'mongoose'

export class UserService {
  static userList: any

  static async createUser(name: string, password: string, role: UserRoles, bossId?: string | mongoose.Schema.Types.ObjectId) {
    const user = await User.create({ name, password, role, bossId })
    return user
  }

  static async findById(id: string | mongoose.Schema.Types.ObjectId) {
    const user = await User.findById(id)
    return user
  }

  static async findAll() {
    const users = await User.find()
    return users
  }

  static async findByName(name: string) {
    const user = await User.findOne({ name })
    return user
  }

  static async updateRole(id: string | mongoose.Schema.Types.ObjectId, role: string) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true })
    return user
  }

  static async updateBoss(userId: string | mongoose.Schema.Types.ObjectId, bossId: string | mongoose.Schema.Types.ObjectId) {
    const user = await User.findByIdAndUpdate(userId, { bossId }, { new: true })
    return user
  }

  static async getUserList(id: string | mongoose.Schema.Types.ObjectId) {
    const usersDB = await this.findAll()
    const filteredUsers = usersDB.filter(u => u.bossId)
    const boss = await this.findById(id)
    if (!boss) return
    this.userList = { user: boss, slaves: [] }
    this.getBossesRecursively(id, filteredUsers, this.userList)
    return this.userList
  }

  static getBossesRecursively(userId: string | mongoose.Schema.Types.ObjectId, users: IUser[], obj: any) {
    const slaves = users.filter(u => String(u.bossId) === String(userId)).map(u => ({user: u, slaves: []}))
    if (slaves.length) {
      obj.slaves = slaves
      slaves.forEach(s => {
        const index = obj.slaves.findIndex((sl: {user: IUser, slaves: any[]}) => String(sl.user._id) === String(s.user._id))
        this.getBossesRecursively(String(s.user._id), users, obj.slaves[index])
      })
    }
  }

  static async createToken(name: string, id: string) {
    const token = jwt.sign({ name, id }, process.env.SECRET as string, { expiresIn: '24h' })
    return token
  }
}
