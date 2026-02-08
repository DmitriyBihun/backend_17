import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { delay } from './middleware/delay.js'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'

dotenv.config()

const app = express()

/**
 * ✅ Разрешённые origin
 * Netlify + локалка
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
]

app.use(
  cors({
    origin: (origin, callback) => {
      // разрешаем запросы без origin (Render health check, Postman)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(delay)

/**
 * ✅ API routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

/**
 * ✅ PORT для Render
 */
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`)
})

