import React, { useState } from 'react'
import api from '../utils/api'
import { toast } from 'react-hot-toast'

const AddIncomeModal = ({ isOpen, onClose, onIncomeAdded }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    icon: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const incomeCategories = [
    { name: 'Salary', icon: '💰' },
    { name: 'Business', icon: '🏢' },
    { name: 'Investments', icon: '📈' },
    { name: 'Freelance', icon: '💻' },
    { name: 'Rental', icon: '🏠' },
    { name: 'Dividends', icon: '📊' },
    { name: 'Bonus', icon: '🎁' },
    { name: 'Gift', icon: '💝' },
    { name: 'Other', icon: '📋' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-set icon when category is selected
    if (name === 'category') {
      const selectedCategory = incomeCategories.find(cat => cat.name === value)
      setFormData(prev => ({
        ...prev,
        icon: selectedCategory?.icon || ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await api.post('/income/add-income', formData)
      if (response.status === 201) {
        toast.success('Income added successfully!')
        setFormData({
          category: '',
          amount: '',
          icon: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        })
        onIncomeAdded()
        onClose()
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to add income')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

 

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box relative">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h3 className="font-bold text-lg mb-4 text-success">Add New Income</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category *</span>
            </label>
            <select
              name="category"
              className="select select-bordered w-full"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {incomeCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Amount *</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input input-bordered w-full"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date</span>
            </label>
            <input
              type="date"
              name="date"
              className="input input-bordered w-full"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Optional description..."
              className="textarea textarea-bordered w-full"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-success ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddIncomeModal 