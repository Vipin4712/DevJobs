import express from 'express'
import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const router = express.Router()


router.get('/', getJobs)

router.get('/mine', protect, restrictTo('recruiter'), getMyJobs)
router.post('/', protect, restrictTo('recruiter'), createJob)
router.put('/:id', protect, restrictTo('recruiter'), updateJob)
router.delete('/:id', protect, restrictTo('recruiter'), deleteJob)

router.get('/:id', getJobById)  

export default router