const mongoose=require('mongoose');
const subCategoryShema=new mongoose.Schema({
    subCategory_name:{
        type:String,
        required:true
    },
    delete:{
        type:Boolean,
        default:false
    }
})

const subCategories=mongoose.model('subCategories',subCategoryShema)
module.exports=subCategories;