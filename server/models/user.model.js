import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['seeker', 'recruiter', 'admin'],
      default: 'seeker',
    },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    parsedSkills: [String],
    manualSkills: [String],
    experienceYears: { type: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
)



const User=mongoose.model('User',userSchema);
export default User;

