import Income from '../models/Income.js'
import Expense from '../models/Expense.js'

export const getDashboardData = async (req, res) => {
    const userId = req.user._id
    try {
        // Get total income
        const totalIncomeResult = await Income.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0

        // Get total expense
        const totalExpenseResult = await Expense.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const totalExpense = totalExpenseResult.length > 0 ? totalExpenseResult[0].total : 0

        // Calculate total balance
        const totalBalance = totalIncome - totalExpense

        // Get last 30 days date range
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        thirtyDaysAgo.setHours(0, 0, 0, 0) // Start of day

        const today = new Date()
        today.setHours(23, 59, 59, 999) // End of day

        // Get last 30 days income using date field
        const last30DaysIncomeResult = await Income.aggregate([
            { 
                $match: { 
                    userId,
                    date: { 
                        $gte: thirtyDaysAgo,
                        $lte: today
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const last30DaysIncome = last30DaysIncomeResult.length > 0 ? last30DaysIncomeResult[0].total : 0

        // Get last 30 days expense using date field
        const last30DaysExpenseResult = await Expense.aggregate([
            { 
                $match: { 
                    userId,
                    date: { 
                        $gte: thirtyDaysAgo,
                        $lte: today
                    }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
        const last30DaysExpense = last30DaysExpenseResult.length > 0 ? last30DaysExpenseResult[0].total : 0

        // Get recent incomes for transactions
        const recentIncomes = await Income.find({
            userId
        }).sort({ createdAt: -1 }).limit(10)

        // Get recent expenses for transactions
        const recentExpenses = await Expense.find({
            userId
        }).sort({ createdAt: -1 }).limit(10)

        // Combine and sort all recent transactions
        const allRecentTransactions = [
            ...recentIncomes.map(income => ({
                ...income.toObject(),
                type: 'income'
            })),
            ...recentExpenses.map(expense => ({
                ...expense.toObject(),
                type: 'expense'
            }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        // Get last 10 transactions
        const last10Transactions = allRecentTransactions.slice(0, 10)

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                totalBalance,
                last30DaysIncome,
                last30DaysExpense,
                last10Transactions
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
