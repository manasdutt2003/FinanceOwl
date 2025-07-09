import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { addExpense, getAllExpenses, deleteExpense, downloadExpense } from '../controllers/expenseController.js'
 const router=express.Router()

 router.post('/add-expense',protect,addExpense)
 router.get('/get-expenses',protect,getAllExpenses)
 router.delete('/delete-expense/:id',protect,deleteExpense)
 router.get('/download-expense',protect,downloadExpense)

 export default router  