import express from 'express'
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from '../controllers/application.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/:jobId', protect, restrictTo('seeker'), applyToJob)
router.get('/mine', protect, restrictTo('seeker'), getMyApplications)
router.get('/job/:jobId', protect, restrictTo('recruiter'), getApplicantsForJob)
router.patch('/:id/status', protect, restrictTo('recruiter'), updateApplicationStatus)

export default router