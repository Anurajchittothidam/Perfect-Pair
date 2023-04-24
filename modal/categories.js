const mongoose=require('mongoose');
const categoryShema=new mongoose.Schema({
    category_name:{
        type:String,
        required:true,
    },
    subCategory:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'subCategories',
        required:true
    }],
    delete:{
        type:Boolean,
        default:false
    }
})
const categories=mongoose.model('categories',categoryShema)
module.exports=categories;
