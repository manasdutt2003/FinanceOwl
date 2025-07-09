import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'})
}
export const getUserInfo=async(req,res)=>{
    const user=await User.findById(req.user.id).select('-password')
    res.status(200).json({
        success:true,
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        }
    })
}

export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:'Please fill all the fields'
        })
    }
    try{
        const userExists=await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                success:false,
                message:'User already exists'
            })
        }
        const user=await User.create({name,email,password})
        const token=generateToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: 'lax'
        })
        res.status(201).json({
            success:true,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            }
        })
        return // Explicitly return after sending response
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const loginUser=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:'Please fill all the fields'
        })
    }
    try{
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }
        const isMatch=await user.comparePassword(password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:'Invalid credentials'
            })
        }
        const token=generateToken(user._id)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: 'lax'
        })
        res.status(200).json({
            success:true,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            }
        })
        return // Explicitly return after sending response
    }catch(error){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
}

export const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};