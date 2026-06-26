import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
    matchScore: { type: Number, default: null },
    missingSkills: [String],
    aiSuggestion: { type: String, default: '' },
  },
  { timestamps: true }
)

// prevent the same seeker from applying to the same job twice
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

const Application = mongoose.model('Application', applicationSchema)
export default Application