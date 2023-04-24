const mongoose=require('mongoose')

const userOTPVerificationSchema=new mongoose.Schema({
    email:String,
    otp:String,
    expiresAt : Date,
})

const userOTPVerification=mongoose.model('userOTPVerification',userOTPVerificationSchema);

module.exports=userOTPVerification;