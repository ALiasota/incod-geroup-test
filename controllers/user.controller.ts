import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { UserService } from '../services/user.service'
import { IRequest } from '../middlewares/autentificate'
import { UserRoles } from '../models/user'
import mongoose from 'mongoose'

export const register = async (req: Request, res: Response) => {
  const { name, password, bossId } = req.body
  const registeredUser = await UserService.findByName(name)
  if (registeredUser) return res.status(401).end('User already registered')

  let role = UserRoles.USER
  if (bossId) {
    if (!mongoose.Types.ObjectId.isValid(bossId)) res.status(400).end('Wrong boss id')
    const boss = await UserService.findById(bossId) 
    if (!boss) return res.status(400).end('Boss not found')
    if (boss.role === UserRoles.USER) UserService.updateRole(boss._id, UserRoles.BOSS)
  }

  const users = await UserService.findAll()
  if (!users.length) role = UserRoles.ADMIN

  const hashPassword = await bcrypt.hash(password.trim(), 10)
  const user = await UserService.createUser(name, hashPassword, role, bossId)
  const token = await UserService.createToken(user.name, String(user._id))
  return { token, user }
}

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body
  const registeredUser = await UserService.findByName(name)
  if (!registeredUser) return res.status(401).end('User not found')

  const checkPassword = await bcrypt.compare(password, registeredUser.password)
  if (!checkPassword) return res.status(401).end('Wrong password')

  const token = await UserService.createToken(registeredUser.name, String(registeredUser._id))
  return { token, user: registeredUser }
}


export const getUserList = async (req: IRequest, res: Response) => {
  const user = req.user
  if (!user || !user._id) return res.status(401).end('User not found')

  let users

  if (user.role === UserRoles.ADMIN) users = await UserService.findAll()
  else if (user.role === UserRoles.USER) users = [user]
  else users = await UserService.getUserList(user._id)

  return { users }
}

export const updateBoss = async (req: IRequest, res: Response) => {
  const user = req.user
  if (!user || !user._id) return res.status(401).end('User not found')

  if (user.role !== UserRoles.ADMIN) return res.status(403).end('You do not have access')
  const { userId, bossId } = req.body
  if (!mongoose.Types.ObjectId.isValid(bossId)) res.status(400).end('Wrong boss id')
  if (!mongoose.Types.ObjectId.isValid(userId)) res.status(400).end('Wrong user id')
  if (userId === bossId) res.status(400).end('bossId and userId are the same')

  const boss = await UserService.findById(bossId)
  if (!boss) return res.status(401).end('Boss not found')
  if (boss.bossId && String(boss.bossId) === userId) res.status(400).end('User can not be the boss of his boss')
  if (boss.role === UserRoles.USER) UserService.updateRole(boss._id, UserRoles.BOSS)

  const updatedUser = await UserService.updateBoss(userId, bossId)

  if (!updatedUser) res.status(400).end('User not found')

  return { user: updatedUser }
}

export const setAdmin = async (req: IRequest, res: Response) => {
  const user = req.user
  if (!user || !user._id) return res.status(401).end('User not found')

  if (user.role !== UserRoles.ADMIN) return res.status(403).end('You do not have access')
  const { userId } = req.body
  if (!mongoose.Types.ObjectId.isValid(userId)) res.status(400).end('Wrong id')

  const updatedUser = await UserService.updateRole(userId, UserRoles.ADMIN)
  
  if (!updatedUser) res.status(400).end('User not found')

  return { user: updatedUser }
}

