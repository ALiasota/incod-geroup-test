import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from '../services/user.service'
import { IUser } from '../models/user'

export interface IRequest extends Request {
  user?: IUser
}

const authentificate = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization = '' } = req.headers
    const [bearer, token] = authorization.split(' ')
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).end('Not authorized')
    }

    const payload = jwt.verify(token, process.env.SECRET as string)
    const user = await UserService.findById((payload as jwt.JwtPayload).id as string)
    if (!user) {
      return res.status(401).end('Not authorized')
    }
    req.user = user
    next()
  } catch (err: any) {
    if (!err.status) {
      err.status = 401
      err.message = 'Not authorized'
    }
    console.log(err)
    next(err)
  }
}

export default authentificate
