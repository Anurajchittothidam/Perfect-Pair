const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    phonenumber:{
        type:Number,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    }

})
const users=mongoose.model('User',userSchema)
module.exports=users;