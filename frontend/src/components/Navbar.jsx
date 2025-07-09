import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { toast } from 'react-hot-toast'

const Navbar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/getUser')
      if (response.status === 200) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      toast.success('Logged out successfully!')
      navigate('/get-started')
    } catch (error) {
      toast.error('Logout failed')
      console.error('Logout error:', error)
    }
  }



  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <NavLink to="/dashboard" className={({isActive})=>isActive ? 'text-green-500' : 'text-gray-500'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/income" className={({isActive})=>isActive ? 'text-green-500' : 'text-gray-500'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Income
              </NavLink>
            </li>
            <li>
              <NavLink to="/expense" className={({isActive})=>isActive ? 'text-green-500' : 'text-gray-500'}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Expenses
              </NavLink>
            </li>
          </ul>
        </div>
        <NavLink to="/dashboard" className="btn btn-ghost text-xl font-bold text-primary">
          💰 ExpenseTracker
        </NavLink>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/dashboard" className={({isActive})=>isActive ?
            'text-green-500': 'text-gray-500'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/income" className={({isActive})=>isActive ? 'text-green-500' : 'text-gray-500'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Income
            </NavLink>
          </li>
          <li>
            <NavLink to="/expense" className={({isActive})=>isActive ? 'text-red-500' : 'text-gray-500'}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              Expenses
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li className="menu-title">
              <span>{user?.name || 'User'}</span>
              <span className="text-xs opacity-60">{user?.email}</span>
            </li>
            <li><NavLink to="/profile">Profile</NavLink></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar 