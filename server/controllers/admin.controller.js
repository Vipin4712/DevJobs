import User from '../models/user.model.js'
import Job from '../models/job.model.js'
import Application from '../models/application.model.js'


export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalSeekers, totalRecruiters, totalJobs, openJobs, totalApplications] =
      await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        User.countDocuments({ role: 'seeker' }),
        User.countDocuments({ role: 'recruiter' }),
        Job.countDocuments(),
        Job.countDocuments({ status: 'open' }),
        Application.countDocuments(),
      ])

    res.status(200).json({
      totalUsers,
      totalSeekers,
      totalRecruiters,
      totalJobs,
      openJobs,
      totalApplications,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query
    const filter = {}
    if (role) filter.role = role

    const skip = (Number(page) - 1) * Number(limit)

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ])

    res.status(200).json({ users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const updateUserStatus = async (req, res) => {
  try {
    const { role, isBanned } = req.body
    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }


    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot modify your own admin account here' })
    }

    if (role !== undefined) {
      const allowedRoles = ['seeker', 'recruiter', 'admin']
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' })
      }
      targetUser.role = role
    }

    if (isBanned !== undefined) {
      targetUser.isBanned = isBanned
    }

    await targetUser.save()

    res.status(200).json({ message: 'User updated successfully', user: targetUser })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getAllJobsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [jobs, total] = await Promise.all([
      Job.find()
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(),
    ])

    res.status(200).json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const deleteJobAdmin = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    await job.deleteOne()
    res.status(200).json({ message: 'Job deleted by admin' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}