import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { addIncome, getAllIncomes, deleteIncome, downloadIncome } from '../controllers/incomeController.js'
 const router=express.Router()

 router.post('/add-income',protect,addIncome)
 router.get('/get-incomes',protect,getAllIncomes)
 router.delete('/delete-income/:id',protect,deleteIncome)
 router.get('/download-income',protect,downloadIncome)

 export default router  