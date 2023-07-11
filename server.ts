import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { config } from 'dotenv'
import usersRouter from './routes/api/users'
const app = express()

config()
app.use(cors())
app.use(express.json())
app.use('/api', usersRouter)

const port = process.env.PORT || 5001
app.use((_: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err: TypeError, _: Request, res: Response, _1: NextFunction) => {
  if (!res.statusCode || res.statusCode === 200) res.status(500).json({ message: err.message })
})

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB Connected...')
  })
  .catch(err => console.log('Error', err))

app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`)
})
