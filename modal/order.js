const mongoose=require('mongoose')
const Schema=mongoose.Schema
const ObjectId=Schema.ObjectId

const orderSchema=new Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    houseName:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    orderItems:[
        {
            productId:{
                type:ObjectId,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            size:{
                type:Number,
                required:true
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        default:"pending"
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        default:"not Paid"
    },
    orderDate:{
        type:String
    },
    deliveryDate:{
        type:String
    }
},
{timestamps:true})

const orders=mongoose.model('order',orderSchema)

module.exports=orders