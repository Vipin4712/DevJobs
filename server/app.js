import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import jobRoutes from './routes/job.routes.js'
import applicationRoutes from './routes/application.routes.js'
import resumeRoutes from './routes/resume.routes.js'
import matchRoutes from './routes/match.routes.js'
import adminRoutes from './routes/admin.routes.js'
import multer from 'multer'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dev-jobs-tau-seven.vercel.app', // hardcode your actual Vercel URL here too
  process.env.CLIENT_URL,
].filter(Boolean) // removes undefined/null entries so they don't silently match

console.log('Allowed origins:', allowedOrigins) // helpful for debugging on Render logs

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('Blocked by CORS:', origin) // you'll see this in Render logs
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// handle preflight OPTIONS requests explicitly
app.options('*', cors())

app.use(express.json())          
app.use(cookieParser())  

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/admin', adminRoutes)

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