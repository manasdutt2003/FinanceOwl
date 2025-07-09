import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const protect=async(req,res,next)=>{
    const token=req.cookies.token // Get token from cookie
    if(!token){
        return res.status(401).json({
            success:false,
            message:'Unauthorized, no token provided'
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decoded.id).select('-password')
        next()
    }catch(error){
        res.status(401).json({
            success:false,
            message:'Unauthorized'
        })
    }
}