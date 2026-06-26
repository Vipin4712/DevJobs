import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please login.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    next()  
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}


export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join(', ')} can do this.`
      })
    }
    next()
  }
}