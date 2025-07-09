import Expense from "../models/Expense.js";
import XLSX from 'xlsx'
export const addExpense = async (req, res) => {
  const { icon, category, amount, date, description } = req.body;
  const userId = req.user._id;
  try {
    if (!icon || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }
    const expense = await Expense.create({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
      description,
    });
    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllExpenses=async(req,res)=>{
    const userId=req.user._id
    try{
        const expenses=await Expense.find({userId}).sort({createdAt:-1})
        res.status(200).json({
            success:true,
            expenses
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const deleteExpense=async(req,res)=>{
    const id=req.params.id
    const userId=req.user._id
    try{
        const expense=await Expense.findOne({_id:id,userId})
        if(!expense){
            return res.status(404).json({
                success:false,
                message:'Expense not found'
            })
        }
        await expense.deleteOne()
        res.status(200).json({
            success:true,
            message:'Expense deleted successfully'
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const downloadExpense=async(req,res)=>{
    const userId=req.user._id
    try{
        const expenses=await Expense.find({userId}).sort({createdAt:-1})
        const expenseData=expenses.map((expense)=>({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date.toISOString().split('T')[0],
            Description: expense.description || '',
            Icon: expense.icon
        }))
        
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(expenseData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expense Data')
        const buffer=XLSX.write(workbook,{type:'buffer',bookType:'xlsx'})
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition','attachment; filename=expense-data.xlsx')
        res.send(buffer)
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}
