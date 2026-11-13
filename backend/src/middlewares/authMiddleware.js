import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, no token provided'
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        // A valid token can outlive its account. Without this check every
        // controller would crash reading req.user._id.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
}
