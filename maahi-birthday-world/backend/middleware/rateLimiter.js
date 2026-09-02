const rateLimit = require('express-rate-limit')

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. The teddy needs a break. 🧸' },
  standardHeaders: true,
  legacyHeaders: false,
})

const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Slow down! Even birthdays need a moment. 🌷' },
})

module.exports = { globalLimiter, postLimiter }
