import express from 'express'
import {
  getStats,
  getAllUsers,
  updateUserStatus,
  getAllJobsAdmin,
  deleteJobAdmin,
} from '../controllers/admin.controller.js'
import { protect, restrictTo } from '../middlewares/auth.middleware.js'

const router = express.Router()

// every route here requires admin role
router.use(protect, restrictTo('admin'))

router.get('/stats', getStats)
router.get('/users', getAllUsers)
router.patch('/users/:id', updateUserStatus)
router.get('/jobs', getAllJobsAdmin)
router.delete('/jobs/:id', deleteJobAdmin)

export default router