import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

dotenv.config()

for (const name of ['MONGO_URI', 'JWT_SECRET']) {
    if (!process.env[name]) {
        console.error(`Missing required environment variable ${name}. See backend/.env.example.`)
        process.exit(1)
    }
}

const PORT = process.env.PORT || 3000
// Comma-separated list, e.g. "http://localhost:5173,https://app.example.com"
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

const app = express()

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

app.get('/api/v1/health', (req, res) => res.json({ success: true }))
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/income', incomeRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

// Malformed JSON bodies and anything a route did not catch end up here.
app.use((error, req, res, next) => {
    const status = error.status || error.statusCode || 500
    if (status >= 500) console.error(error)
    res.status(status).json({
        success: false,
        message: status >= 500 ? 'Internal server error' : error.message
    })
})

// Connect first so the server never accepts requests it cannot serve.
await connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
