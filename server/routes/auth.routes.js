import express from 'express'
import { register, login, logout, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', protect, logout)  // must be logged in to logout
router.get('/me', protect, getMe)        // protected route example

export default router