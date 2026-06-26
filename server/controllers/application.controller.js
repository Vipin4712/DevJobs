import Application from '../models/application.model.js'
import Job from '../models/job.model.js'

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' })
    }

    // check for duplicate application (friendlier error than raw DB error)
    const existing = await Application.findOne({ job: jobId, applicant: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job' })
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resumeUrl: req.user.resumeUrl || '',
    })


    job.applicantCount += 1
    await job.save()

    res.status(201).json({ message: 'Application submitted successfully', application })
  } catch (err) {

    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' })
    }
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type status salaryMin salaryMax')
      .sort({ createdAt: -1 })

    res.status(200).json({ applications })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view applicants for your own job postings' })
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email parsedSkills manualSkills experienceYears resumeUrl location')
      .sort({ createdAt: -1 })

    res.status(200).json({ applications })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body
    const allowedStatuses = ['applied', 'shortlisted', 'rejected', 'hired']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    const application = await Application.findById(req.params.id).populate('job')
    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }


    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' })
    }

    application.status = status
    await application.save()

    res.status(200).json({ message: 'Application status updated', application })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}