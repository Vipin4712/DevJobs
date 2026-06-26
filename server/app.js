import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import jobRoutes from './routes/job.routes.js'
import applicationRoutes from './routes/application.routes.js'
import resumeRoutes from './routes/resume.routes.js'
import multer from 'multer'

const app = express()

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}))
app.use(express.json())          
app.use(cookieParser())  

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/resume', resumeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

// this is used to handle the multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Max size is 5MB.' })
    }
    return res.status(400).json({ message: err.message })
  }

  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ message: err.message })
  }

  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

export default app