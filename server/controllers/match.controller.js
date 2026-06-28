import Job from '../models/job.model.js'
import Application from '../models/application.model.js'
import User from '../models/user.model.js'
import { getMatchScore } from '../utils/gemini.js'   

export const generateMatch = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const user = await User.findById(req.user._id)

    const candidateSkills = [...new Set([...(user.parsedSkills || []), ...(user.manualSkills || [])])]

    if (candidateSkills.length === 0) {
      return res.status(400).json({ message: 'Please upload a resume or add skills before checking match score' })
    }

    const result = await getMatchScore({
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skills,
      candidateSkills,
      experienceYears: user.experienceYears || 0,
    })

    let application = await Application.findOne({ job: jobId, applicant: req.user._id })

    if (application) {
      application.matchScore = result.matchScore
      application.missingSkills = result.missingSkills
      application.aiSuggestion = result.suggestion
      await application.save()
    }

    res.status(200).json({
      message: 'Match score generated',
      matchScore: result.matchScore,
      missingSkills: result.missingSkills,
      strengths: result.strengths,
      suggestion: result.suggestion,
    })
  } catch (err) {
    console.error('Gemini match error:', err.message)
    res.status(500).json({ message: 'Failed to generate match score. Please try again.' })
  }
}


export const getCachedMatch = async (req, res) => {
  try {
    const { jobId } = req.params

    const application = await Application.findOne({ job: jobId, applicant: req.user._id })

    if (!application || application.matchScore === null) {
      return res.status(404).json({ message: 'No match score found. Generate one first.' })
    }

    res.status(200).json({
      matchScore: application.matchScore,
      missingSkills: application.missingSkills,
      suggestion: application.aiSuggestion,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}