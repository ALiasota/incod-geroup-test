import { Router } from 'express'
import { register, login, getUserList, updateBoss, setAdmin } from '../../controllers/user.controller'
import asyncWrapper from '../../middlewares/asyncWrapper'
import authentificate from '../../middlewares/autentificate'
import { authValidation, setAdminValidation, updateBossValidation } from '../../middlewares/validation'

const authRouter: Router = Router()

authRouter.post('/register', authValidation, asyncWrapper(register))

authRouter.post('/login', authValidation, asyncWrapper(login))

authRouter.get('/', authentificate, asyncWrapper(getUserList))

authRouter.patch('/admin', authentificate, setAdminValidation, asyncWrapper(setAdmin))

authRouter.patch('/boss', authentificate, updateBossValidation, asyncWrapper(updateBoss))

export default authRouter
