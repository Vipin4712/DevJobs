import Job from '../models/job.model.js'

export const createJob = async (req, res) => {
  try {
    const { title, company, description, skills, location, type, salaryMin, salaryMax } = req.body

    if (!title || !company || !description || !skills || !location || !type) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const job = await Job.create({
      title,
      company,
      description,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      location,
      type,
      salaryMin,
      salaryMax,
      postedBy: req.user._id,  // comes from auth middleware
    })

    res.status(201).json({ message: 'Job posted successfully', job })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getJobs = async (req, res) => {
  try {
    const { skills, location, type, minSalary, page = 1, limit = 10, search } = req.query

    const filter = { status: 'open' }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim())
      filter.skills = { $in: skillsArray }
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }
    }

    if (type) {
      filter.type = type
    }

    if (minSalary) {
      filter.salaryMax = { $gte: Number(minSalary) }
    }

    if (search) {
      filter.$text = { $search: search }
    }

    const skip = (Number(page) - 1) * Number(limit)

    // when searching by text, sort by relevance score; otherwise sort by newest
    const sortStage = search
      ? { score: { $meta: 'textScore' } }
      : { createdAt: -1 }

    const projectStage = search ? { score: { $meta: 'textScore' } } : {}

    const [jobs, total] = await Promise.all([
      Job.find(filter, projectStage)
        .populate('postedBy', 'name')
        .sort(sortStage)
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(filter),
    ])

    res.status(200).json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email')

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    res.status(200).json({ job })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({ jobs })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // ownership check — critical security step
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own job postings' })
    }

    const allowedFields = ['title', 'company', 'description', 'skills', 'location', 'type', 'salaryMin', 'salaryMax', 'status']
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field]
      }
    })

    await job.save()
    res.status(200).json({ message: 'Job updated successfully', job })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own job postings' })
    }

    await job.deleteOne()
    res.status(200).json({ message: 'Job deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}