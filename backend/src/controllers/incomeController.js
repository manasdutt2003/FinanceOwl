import mongoose from 'mongoose'
import Income from "../models/Income.js";
import XLSX from 'xlsx'

export const addIncome = async (req, res) => {
  const { icon, category, amount, date, description } = req.body;
  const userId = req.user._id;
  try {
    if (!icon || !category || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number greater than 0",
      });
    }
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Date is not valid",
      });
    }
    const income = await Income.create({
      userId,
      icon,
      category,
      amount: numericAmount,
      date: parsedDate,
      description,
    });
    res.status(201).json({
      success: true,
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllIncomes=async(req,res)=>{
    const userId=req.user._id
    try{
        const incomes=await Income.find({userId}).sort({createdAt:-1})
        res.status(200).json({
            success:true,
            incomes
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const deleteIncome=async(req,res)=>{
    const id=req.params.id
    const userId=req.user._id
    try{
        if(!mongoose.isValidObjectId(id)){
            return res.status(404).json({
                success:false,
                message:'Income not found'
            })
        }
        const income=await Income.findOne({_id:id,userId})
        if(!income){
            return res.status(404).json({
                success:false,
                message:'Income not found'
            })
        }
        await income.deleteOne()
        res.status(200).json({
            success:true,
            message:'Income deleted successfully'
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const downloadIncome=async(req,res)=>{
    const userId=req.user._id
    try{
        const incomes=await Income.find({userId}).sort({createdAt:-1})
        const incomeData=incomes.map((income)=>({
            Category: income.category,
            Amount: income.amount,
            Date: income.date.toISOString().split('T')[0],
            Description: income.description || '',
            Icon: income.icon
        }))
        
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(incomeData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Income Data')
        const buffer=XLSX.write(workbook,{type:'buffer',bookType:'xlsx'})
        res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition','attachment; filename=income-data.xlsx')
        res.send(buffer)
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}