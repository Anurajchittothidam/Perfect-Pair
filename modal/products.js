const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'categories'
    },
    subCategory:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'subCategories'
    },
    brand:{
        type:String,
        required:true
    },
    image:[{
        path:String
    }],  
    description:{
        type:String,
        required:true
    },
    stock:{
        type:String,
        required:true
    },
    size:[Number],
    delete:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const product=mongoose.model('products',productSchema)

module.exports=product;