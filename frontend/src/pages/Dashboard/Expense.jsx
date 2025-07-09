import React, { useState, useEffect } from 'react'
import api from '../../utils/api'
import { toast } from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import AddExpenseModal from '../../components/AddExpenseModal'
import DeleteConfirmModal from '../../components/DeleteConfirmModal'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Expense = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expense/get-expenses')
      if (response.status === 200) {
        setExpenses(response.data.expenses || [])
      }
    } catch (error) {
      toast.error('Failed to fetch expenses')
      console.error('Fetch expenses error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (expense) => {
    setDeleteModal({ isOpen: true, item: expense })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return

    try {
      const response = await api.delete(`/expense/delete-expense/${deleteModal.item._id}`)
      if (response.status === 200) {
        toast.success('Expense deleted successfully!')
        fetchExpenses()
      }
    } catch (error) {
      toast.error('Failed to delete expense')
      console.error('Delete expense error:', error)
    } finally {
      setDeleteModal({ isOpen: false, item: null })
    }
  }

  const totalExpense = expenses.reduce((total, expense) => total + (expense.amount || 0), 0)

  // Prepare data for line chart (expenses over time)
  const getLineChartData = () => {
    if (!expenses.length) return null

    // Group expenses by date
    const groupedByDate = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date || expense.createdAt).toLocaleDateString()
      if (!acc[date]) acc[date] = 0
      acc[date] += expense.amount || 0
      return acc
    }, {})

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b))
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Expenses',
          data: sortedDates.map(date => groupedByDate[date]),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.1,
          fill: true,
        },
      ],
    }
  }

  // Prepare data for pie chart (expenses by category)
  const getPieChartData = () => {
    if (!expenses.length) return null

    const groupedByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other'
      if (!acc[category]) acc[category] = 0
      acc[category] += expense.amount || 0
      return acc
    }, {})

    const categories = Object.keys(groupedByCategory)
    const colors = [
      'rgba(239, 68, 68, 0.8)',
      'rgba(220, 38, 38, 0.8)',
      'rgba(185, 28, 28, 0.8)',
      'rgba(153, 27, 27, 0.8)',
      'rgba(127, 29, 29, 0.8)',
      'rgba(153, 27, 27, 0.8)',
      'rgba(185, 28, 28, 0.8)',
      'rgba(220, 38, 38, 0.8)',
      'rgba(248, 113, 113, 0.8)',
    ]

    return {
      labels: categories,
      datasets: [
        {
          data: categories.map(category => groupedByCategory[category]),
          backgroundColor: colors.slice(0, categories.length),
          borderColor: colors.slice(0, categories.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
        },
      ],
    }
  }

  const lineChartData = getLineChartData()
  const pieChartData = getPieChartData()

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-error mb-2">Expense Management</h1>
              <p className="text-base-content/70">Track and manage your expenses</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="card bg-base-100 shadow-xl stat">
                <div className="stat-title">Total Expenses</div>
                <div className="stat-value text-error">${totalExpense.toLocaleString()}</div>
                <div className="stat-desc">All time spending</div>
              </div>
              <button 
                className="btn btn-error btn-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {expenses.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Line Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-error mb-4">Expenses Over Time</h2>
                <div className="h-64">
                  {lineChartData && <Line data={lineChartData} options={chartOptions} />}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-error mb-4">Expenses by Category</h2>
                <div className="h-64">
                  {pieChartData && <Doughnut data={pieChartData} options={chartOptions} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expense Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Expense Records</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense._id}>
                        <td>
                          <div className="font-bold">
                            <span className="badge badge-error badge-outline">
                              {expense.icon} {expense.category}
                            </span>
                          </div>
                        </td>
                        <td className="font-bold text-error">
                          ${expense.amount?.toLocaleString()}
                        </td>
                        <td>{new Date(expense.date || expense.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="max-w-xs">
                            <p className="text-sm opacity-70 truncate">
                              {expense.description || 'No description'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className="btn btn-error btn-sm"
                            title="Delete expense"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-base-content/30 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                <p className="text-xl font-semibold text-base-content/70 mb-2">No expense records yet</p>
                <p className="text-base-content/50">Add your first expense to see analytics and track your spending!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={fetchExpenses}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to delete this expense record of $${deleteModal.item?.amount?.toLocaleString()} from ${deleteModal.item?.category}?`}
        type="error"
      />
    </div>
  )
}

export default Expense
