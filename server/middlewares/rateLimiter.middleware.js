import rateLimit from 'express-rate-limit'

export const matchRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // max 10 match-score generations per hour per IP
  message: { message: 'Too many match score requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})