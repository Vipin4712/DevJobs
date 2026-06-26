import User from '../models/user.model.js'
import { uploadBufferToCloudinary } from '../utils/uploadBuffer.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' })
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, 'resumes')

    const extractedText = await extractTextFromPDF(req.file.buffer)

    const user = await User.findById(req.user._id)
    user.resumeUrl = result.secure_url
    await user.save()

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resumeUrl: result.secure_url,
      extractedTextPreview: extractedText.slice(0, 300), 
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