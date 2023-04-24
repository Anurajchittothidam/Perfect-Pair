const mongoose=require('mongoose')
const Schema=mongoose.Schema
const moment=require('moment')

const couponSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    maxLimit:{
        type:Number,
        required:true
    },
    minLimit:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        default:moment().format("DD/MM/YYYY") +" "+ moment().format("hh:mm:s"),
        required:true
    },
    delete:{
        type:Boolean,
        default:false
    },
    users:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
            }
        }
    ]
})

const coupon=mongoose.model('coupons',couponSchema)
module.exports=coupon;