import User from '../models/user.model.js'
import { uploadBufferToCloudinary } from '../utils/uploadBuffer.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { extractSkills, extractExperienceYears } from '../utils/skillExtractor.js'

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' })
    }

  
    const result = await uploadBufferToCloudinary(req.file.buffer, 'resumes')


    const extractedText = await extractTextFromPDF(req.file.buffer)

    const parsedSkills = extractSkills(extractedText)
    const experienceYears = extractExperienceYears(extractedText)


    const user = await User.findById(req.user._id)
    user.resumeUrl = result.secure_url
    user.parsedSkills = parsedSkills
    user.experienceYears = experienceYears
    await user.save()

    res.status(200).json({
      message: 'Resume uploaded and parsed successfully',
      resumeUrl: result.secure_url,
      parsedSkills,
      experienceYears,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const getResumeInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'resumeUrl parsedSkills manualSkills experienceYears'
    )
    res.status(200).json({ resumeInfo: user })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const updateManualSkills = async (req, res) => {
  try {
    const { manualSkills } = req.body

    if (!Array.isArray(manualSkills)) {
      return res.status(400).json({ message: 'manualSkills must be an array' })
    }

    const user = await User.findById(req.user._id)
    user.manualSkills = manualSkills
    await user.save()

    res.status(200).json({ message: 'Skills updated', manualSkills: user.manualSkills })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}