const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()

const { globalLimiter } = require('./middleware/rateLimiter')
const apiRoutes = require('./routes/api')

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: false,
}))

// Body parsing
app.use(express.json({ limit: '10kb' }))

// Global rate limiting
app.use(globalLimiter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Birthday server is running 🌷🧸', timestamp: new Date() })
})

// API routes
app.use('/api', apiRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found 🧸' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message)
  res.status(500).json({ error: 'Something went wrong. The teddy is investigating. 🧸' })
})

// Try to connect to MongoDB (optional)
async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      const connectDB = require('./config/db')
      await connectDB()
    } else {
      console.log('⚠️  No MONGODB_URI set — running without database (fully functional).')
    }
  } catch (err) {
    console.log('⚠️  MongoDB unavailable — running without database.')
  }

  app.listen(PORT, () => {
    console.log(`\n🌷 Birthday server running on http://localhost:${PORT}`)
    console.log(`🧸 The teddy is ready.\n`)
  })
}

startServer()
