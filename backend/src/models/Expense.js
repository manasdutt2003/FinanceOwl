import mongoose from 'mongoose'

const expenseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        default: null
    }
},{timestamps:true})

const Expense=mongoose.model('Expense',expenseSchema)

export default Expense