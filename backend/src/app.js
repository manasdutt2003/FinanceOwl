import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Comma-separated list, e.g. "http://localhost:5173,https://app.example.com"
export const parseAllowedOrigins = (value = 'http://localhost:5173') =>
    value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)

// Environment variables are read when the app is created (not at import
// time), so dotenv has already run by then.
export const createApp = () => {
    const app = express()

    app.use(cors({
        origin: parseAllowedOrigins(process.env.CLIENT_ORIGIN || undefined),
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
    // eslint-disable-next-line no-unused-vars
    app.use((error, req, res, next) => {
        const status = error.status || error.statusCode || 500
        if (status >= 500) console.error(error)
        res.status(status).json({
            success: false,
            message: status >= 500 ? 'Internal server error' : error.message
        })
    })

    return app
}
