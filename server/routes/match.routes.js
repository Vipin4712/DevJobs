import express from 'express'
import { generateMatch, getCachedMatch } from '../controllers/match.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import { matchRateLimiter } from '../middlewares/rateLimiter.middleware.js'

const router = express.Router()

router.post('/:jobId', protect, restrictTo('seeker'), matchRateLimiter, generateMatch)
router.get('/:jobId', protect, restrictTo('seeker'), getCachedMatch)

export default router