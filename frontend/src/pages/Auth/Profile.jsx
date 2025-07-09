import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpenses, setTotalExpenses] = useState(0)
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, incomeResponse, expenseResponse] = await Promise.all([
                    api.get('/auth/getUser'),
                    api.get('/income/get-incomes'),
                    api.get('/expense/get-expenses')
                ])
                
                setUser(userResponse.data.user)
                
                const incomeTotal = incomeResponse.data.incomes?.reduce((sum, income) => sum + income.amount, 0) || 0
                const expenseTotal = expenseResponse.data.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
                
                setTotalIncome(incomeTotal)
                setTotalExpenses(expenseTotal)
            } catch (error) {
                console.error('Error fetching user data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchUserData()
    }, [])

    const totalBalance = totalIncome - totalExpenses

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="btn btn-ghost btn-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-base-content mb-2">Profile</h1>
                    <p className="text-base-content/60">Your account information</p>
                </div>

                {/* Profile Card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-base-content/10 flex items-center justify-center mb-4">
                                <span className="text-3xl font-bold">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-base-content">{user?.name || 'User'}</h2>
                            <p className="text-base-content/60">{user?.email}</p>
                        </div>

                        {/* Profile Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Full Name</span>
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200">
                                    <svg className="w-5 h-5 mr-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-base-content">{user?.name || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Email Address</span>
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200">
                                    <svg className="w-5 h-5 mr-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="text-base-content">{user?.email || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">User ID</span>
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200">
                                    <svg className="w-5 h-5 mr-3 text-base-content/60" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-base-content font-mono text-sm">{user?._id || 'Not available'}</span>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Account Status</span>
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200">
                                    <svg className="w-5 h-5 mr-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-success font-semibold">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="mt-8">
                    <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content">
                        <div className="card-body items-center text-center">
                            <svg className="w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <h3 className="card-title text-lg mb-2">Total Balance</h3>
                            <p className={`text-4xl font-bold ${totalBalance >= 0 ? 'text-success-content' : 'text-error-content'}`}>
                                ${totalBalance.toLocaleString()}
                            </p>
                            <div className="flex gap-4 mt-4 text-sm opacity-80">
                                <span>Income: ${totalIncome.toLocaleString()}</span>
                                <span>Expenses: ${totalExpenses.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile