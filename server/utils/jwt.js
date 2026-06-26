import jwt from 'jsonwebtoken'

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },              // payload
    process.env.JWT_SECRET,            // secret
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

export const sendTokenAsCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,     // JS can't access it — prevents XSS
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'strict', // prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
  })
}