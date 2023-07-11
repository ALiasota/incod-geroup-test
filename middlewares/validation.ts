import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    bossId: Joi.string(),
  })
  const valid = schema.validate(req.body)

  if (valid.error) {
    return res.status(400).end(valid.error.details[0].message)
  }
  next()
}

export const setAdminValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
    })
    const valid = schema.validate(req.body)
  
    if (valid.error) {
        return res.status(400).end(valid.error.details[0].message)
    }
    next()
  }

  export const updateBossValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
      bossId: Joi.string().required(),
    })
    const valid = schema.validate(req.body)
  
    if (valid.error) {
        return res.status(400).end(valid.error.details[0].message)
    }
    next()
  }
  
