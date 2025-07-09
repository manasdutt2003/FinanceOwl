import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { toast } from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    last30DaysIncome: 0,
    last30DaysExpense: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  })
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    incomeByCategory: {},
    expenseByCategory: {}
  })

  useEffect(() => {
    fetchDashboardData()
    fetchChartData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard')
      if (response.status === 200) {
        const data = response.data.data
        setDashboardData({
          last30DaysIncome: data.last30DaysIncome || 0,
          last30DaysExpense: data.last30DaysExpense || 0,
          totalExpenses: data.last30DaysExpense || 0,
          balance: data.totalBalance || 0,
          recentTransactions: data.last10Transactions || []
        })
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error('Dashboard data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        api.get('/income/get-incomes'),
        api.get('/expense/get-expenses')
      ])

      // Process income data by category
      const incomes = incomeResponse.data.incomes || []
      const incomeByCategory = incomes.reduce((acc, income) => {
        acc[income.category] = (acc[income.category] || 0) + income.amount
        return acc
      }, {})

      // Process expense data by category
      const expenses = expenseResponse.data.expenses || []
      const expenseByCategory = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {})

      setChartData({ incomeByCategory, expenseByCategory })
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    }
  }

  // Prepare chart data
  const incomeChartData = {
    labels: Object.keys(chartData.incomeByCategory),
    datasets: [
      {
        label: 'Income by Category',
        data: Object.values(chartData.incomeByCategory),
        backgroundColor: [
          '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
          '#6ee7b7', '#34d399', '#10b981', '#059669'
        ],
        borderColor: '#047857',
        borderWidth: 1,
      },
    ],
  }

  const expenseChartData = {
    labels: Object.keys(chartData.expenseByCategory),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(chartData.expenseByCategory),
        backgroundColor: [
          '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
          '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c',
          '#991b1b', '#7f1d1d', '#fee2e2'
        ],
        borderColor: '#b91c1c',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Overview',
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-base-content/70">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="card bg-gradient-to-r from-success to-success/80 text-white shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-white/90">Last 30 Days Income</h2>
                  <p className="text-3xl font-bold">${dashboardData.last30DaysIncome?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-white/70">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="card bg-gradient-to-r from-error to-error/80 text-white shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-white/90">Last 30 Days Expenses</h2>
                  <p className="text-3xl font-bold">${dashboardData.last30DaysExpense?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-white/70">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`card ${dashboardData.balance >= 0 ? 'bg-gradient-to-r from-info to-info/80' : 'bg-gradient-to-r from-warning to-warning/80'} text-white shadow-xl`}>
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-white/90">Balance</h2>
                  <p className="text-3xl font-bold">${dashboardData.balance?.toLocaleString() || '0'}</p>
                </div>
                <div className="text-white/70">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-success mb-4">Income by Category</h2>
              {Object.keys(chartData.incomeByCategory).length > 0 ? (
                <div className="h-64">
                  <Doughnut data={incomeChartData} options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: false }
                    }
                  }} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-base-content/50">
                  No income data available
                </div>
              )}
            </div>
          </div>

          {/* Expense Chart */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error mb-4">Expenses by Category</h2>
              {Object.keys(chartData.expenseByCategory).length > 0 ? (
                <div className="h-64">
                  <Doughnut data={expenseChartData} options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: { display: false }
                    }
                  }} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-base-content/50">
                  No expense data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/income" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="bg-success/20 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add Income</h3>
                  <p className="text-base-content/70">Record your earnings</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/expense" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className="bg-error/20 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-error" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add Expense</h3>
                  <p className="text-base-content/70">Track your spending</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Recent Transactions</h2>
            {dashboardData.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentTransactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="font-medium">
                          {transaction.category}
                        </td>
                        <td>
                          <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-error'} badge-outline`}>
                            {transaction.icon}
                          </span>
                        </td>
                        <td className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount?.toLocaleString()}
                        </td>
                        <td>
                          <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-error'}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td>{transaction.description}</td>
                        <td>{new Date(transaction.date || transaction.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
                <p className="text-base-content/70">No transactions yet. Start by adding your income or expenses!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
