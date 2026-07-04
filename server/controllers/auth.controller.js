import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateToken } from '../utils/jwt.js'


export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const allowedRoles = ['seeker', 'recruiter']
    const userRole = allowedRoles.includes(role) ? role : 'seeker'

    // hash password here instead of in the model
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    })

    const token = generateToken(user._id, user.role)
    sendTokenAsCookie(res, token)

    res.status(201).json({
      message: 'Registered successfully',
      token, 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been banned' })
    }

    // compare directly here instead of calling a model method
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id, user.role)
    sendTokenAsCookie(res, token)

    res.status(200).json({
      message: 'Logged in successfully',
      token, 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}


export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' })
}


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}