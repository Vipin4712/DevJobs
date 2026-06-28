import express from 'express'
import { uploadResume, getResumeInfo ,updateManualSkills } from '../controllers/resume.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'

const router = express.Router()

router.post('/upload', protect, restrictTo('seeker'), upload.single('resume'), uploadResume)
router.get('/info', protect, restrictTo('seeker'), getResumeInfo)
router.patch('/manual-skills', protect, restrictTo('seeker'), updateManualSkills)

export default router