import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
dotenv.config()

const app=express()

app.use(cors(
    {
        origin:'http://localhost:5173',
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization'],
        credentials:true
    }
))
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1/auth",authRoutes)
app.use('/api/v1/income',incomeRoutes)
app.use('/api/v1/expense',expenseRoutes)
app.use('/api/v1/dashboard',dashboardRoutes)


app.listen(process.env.PORT,async()=>{
    await connectDB()
    console.log(`Server is running on port ${process.env.PORT}`)
})