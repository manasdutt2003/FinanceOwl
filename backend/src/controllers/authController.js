import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const MIN_PASSWORD_LENGTH = 6

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// The cookie must be cleared with the same attributes it was set with,
// otherwise some browsers keep it after logout.
const cookieOptions = () => {
    const production = process.env.NODE_ENV === 'production'
    return {
        httpOnly: true,
        secure: production,
        // A frontend hosted on a different site needs SameSite=None (which
        // requires Secure). Set COOKIE_SAME_SITE=none for that deployment.
        sameSite: process.env.COOKIE_SAME_SITE || 'lax'
    }
}

const publicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email
})

const sendSession = (res, status, user) => {
    res.cookie('token', generateToken(user._id), { ...cookieOptions(), maxAge: THIRTY_DAYS_MS })
    res.status(status).json({ success: true, user: publicUser(user) })
}

export const getUserInfo = async (req, res) => {
    // `protect` already loaded the user without the password.
    res.status(200).json({ success: true, user: publicUser(req.user) })
}

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body ?? {}
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields'
        })
    }
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid input' })
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
            success: false,
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        })
    }
    try {
        const normalisedEmail = email.trim().toLowerCase()
        const userExists = await User.findOne({ email: normalisedEmail })
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }
        const user = await User.create({ name: name.trim(), email: normalisedEmail, password })
        sendSession(res, 201, user)
    } catch (error) {
        // Two simultaneous sign-ups can both pass the check above; the unique
        // index then rejects the second one.
        if (error?.code === 11000) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields'
        })
    }
    // Reject objects such as {"$gt": ""}, which would otherwise be passed to
    // MongoDB as a query operator.
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }
    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() })
        // Same message for an unknown email and a wrong password, so the
        // endpoint cannot be used to discover which emails are registered.
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        sendSession(res, 200, user)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const logoutUser = async (req, res) => {
    res.clearCookie('token', cookieOptions())
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })
}
