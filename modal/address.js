const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;
const addressSchema=new Schema({
    userId:{
        type:ObjectId,
        required:true
    },
        addressDetails:[
        {
            fullName:{
                type:String,
                required:true
            },
            phoneNumber:{
                type:Number,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            district:{
                type:String,
                required:true
            }  ,
            pincode:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            houseName:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            }
        }
    ]   
},
{
    timestamps: true,
})

const address=mongoose.model('address',addressSchema)
module.exports=address