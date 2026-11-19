import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import { createApp } from './app.js'

dotenv.config()

for (const name of ['MONGO_URI', 'JWT_SECRET']) {
    if (!process.env[name]) {
        console.error(`Missing required environment variable ${name}. See backend/.env.example.`)
        process.exit(1)
    }
}

const PORT = process.env.PORT || 3000
const app = createApp()

// Connect first so the server never accepts requests it cannot serve.
await connectDB()
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Let in-flight requests finish and close the database cleanly, e.g. when
// a container is stopped.
const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`)
    server.close(async () => {
        await mongoose.connection.close()
        process.exit(0)
    })
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
