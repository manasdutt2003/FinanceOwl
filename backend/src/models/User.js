import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
userSchema.pre('save',async function(){
    // Only hash when the password changed. The original fell through after
    // calling next(), so saving any other field re-hashed the stored hash
    // and locked the user out.
    if(!this.isModified('password')){
        return
    }
    this.password=await bcrypt.hash(this.password,10)
})
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
const User=mongoose.model('User',userSchema)
export default User