import React, { useState, useEffect } from 'react'
import api from '../../utils/api'
import { toast } from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import AddIncomeModal from '../../components/AddIncomeModal'
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

const Income = () => {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null })

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    try {
      const response = await api.get('/income/get-incomes')
      if (response.status === 200) {
        setIncomes(response.data.incomes || [])
      }
    } catch (error) {
      toast.error('Failed to fetch incomes')
      console.error('Fetch incomes error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (income) => {
    setDeleteModal({ isOpen: true, item: income })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return

    try {
      const response = await api.delete(`/income/delete-income/${deleteModal.item._id}`)
      if (response.status === 200) {
        toast.success('Income deleted successfully!')
        fetchIncomes()
      }
    } catch (error) {
      toast.error('Failed to delete income')
      console.error('Delete income error:', error)
    } finally {
      setDeleteModal({ isOpen: false, item: null })
    }
  }

  const totalIncome = incomes.reduce((total, income) => total + (income.amount || 0), 0)

  // Prepare data for line chart (income over time)
  const getLineChartData = () => {
    if (!incomes.length) return null

    // Group incomes by date
    const groupedByDate = incomes.reduce((acc, income) => {
      const date = new Date(income.date || income.createdAt).toLocaleDateString()
      if (!acc[date]) acc[date] = 0
      acc[date] += income.amount || 0
      return acc
    }, {})

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b))
    
    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Income',
          data: sortedDates.map(date => groupedByDate[date]),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.1,
          fill: true,
        },
      ],
    }
  }

  // Prepare data for pie chart (income by category)
  const getPieChartData = () => {
    if (!incomes.length) return null

    const groupedByCategory = incomes.reduce((acc, income) => {
      const category = income.category || 'Other'
      if (!acc[category]) acc[category] = 0
      acc[category] += income.amount || 0
      return acc
    }, {})

    const categories = Object.keys(groupedByCategory)
    const colors = [
      'rgba(34, 197, 94, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(5, 150, 105, 0.8)',
      'rgba(4, 120, 87, 0.8)',
      'rgba(6, 95, 70, 0.8)',
      'rgba(6, 78, 59, 0.8)',
      'rgba(20, 83, 45, 0.8)',
      'rgba(22, 101, 52, 0.8)',
      'rgba(21, 128, 61, 0.8)',
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
              <h1 className="text-4xl font-bold text-success mb-2">Income Management</h1>
              <p className="text-base-content/70">Track and manage your income sources</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="card bg-base-100 shadow-xl stat">
                <div className="stat-title">Total Income</div>
                <div className="stat-value text-success">${totalIncome.toLocaleString()}</div>
                <div className="stat-desc">All time earnings</div>
              </div>
              <button 
                className="btn btn-success btn-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Income
              </button>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {incomes.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Line Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-success mb-4">Income Over Time</h2>
                <div className="h-64">
                  {lineChartData && <Line data={lineChartData} options={chartOptions} />}
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-success mb-4">Income by Category</h2>
                <div className="h-64">
                  {pieChartData && <Doughnut data={pieChartData} options={chartOptions} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Income Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Income Records</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : incomes.length > 0 ? (
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
                    {incomes.map((income) => (
                      <tr key={income._id}>
                        <td>
                          <div className="font-bold">
                            <span className="badge badge-success badge-outline">
                              {income.icon} {income.category}
                            </span>
                          </div>
                        </td>
                        <td className="font-bold text-success">
                          ${income.amount?.toLocaleString()}
                        </td>
                        <td>{new Date(income.date || income.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="max-w-xs">
                            <p className="text-sm opacity-70 truncate">
                              {income.description || 'No description'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteClick(income)}
                            className="btn btn-error btn-sm"
                            title="Delete income"
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                <p className="text-xl font-semibold text-base-content/70 mb-2">No income records yet</p>
                <p className="text-base-content/50">Add your first income to see analytics and track your earnings!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddIncomeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIncomeAdded={fetchIncomes}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Income"
        message={`Are you sure you want to delete this income record of $${deleteModal.item?.amount?.toLocaleString()} from ${deleteModal.item?.category}?`}
        type="error"
      />
    </div>
  )
}

export default Income
