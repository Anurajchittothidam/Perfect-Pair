const products=require('../modal/products');
const sharp=require('sharp')
const mongoose=require('mongoose')
const category=require('../modal/categories')


const addProduct=async (req,res,next)=>{
    try{
       
        const categoryId=req.body.category;
        const subCategoryId=req.body.subCategory
      
        const images = req.files.map(file => ({ path: file.filename }));
        const addproduct={
            category:categoryId,
            subCategory:subCategoryId,
            name:req.body.product_name,
            price:req.body.price,
            stock: req.body.stock,
            size: req.body.size,
            brand:req.body.brand,
            description:req.body.description,
            image:images
        }
            const product=new products({
            
                category:categoryId,
                subCategory:subCategoryId,
                name:req.body.product_name,
                price:req.body.price,
                stock: req.body.stock,
                size: req.body.size,
                brand:req.body.brand,
                description:req.body.description,
                image:images
            })
            await product.save()
            res.redirect("/admin/products-list")
        
    }catch(err){
        res.redirect('/admin/error')
    }
}

const getProduct=async(req,res,next)=>{
    try{
        const product=await products.find().populate('category').populate('subCategory')
        const message=req.session.proErr;
        if(message){
            delete req.session.proErr
        }
        res.render('./admin/product-details',{product,message})
    }catch(err){
        res.redirect('/admin/error');
    }
}


const editImage = async (req, res, next) => {
    try {
      const id = req.params.id;
      const imageId = req.params.imageId;
      const imageFile = req.file;
  
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid product ID');
      }
      if (!imageId || !mongoose.Types.ObjectId.isValid(imageId)) {
        return res.status(400).send('Invalid image ID');
      }
      if (!imageFile) {
        return res.status(400).send('No image file uploaded');
      }
  
      const result = await products.updateOne(
        { _id: id, 'image._id': imageId },
        { $set: { 'image.$.path': imageFile.filename } }
      );
  
      if (result.nModified === 0) {
        return res.status(404).send('Image not found for product');
      }
  
      res.redirect(`/admin/editPage/${id}`);
    } catch (err) {
      res.redirect('/admin/error');
    }
  };
  

const editPage = async (req, res, next) => {
    try {
        const id =req.params.id
      
        const categories = await category.find();
        const product = await products.findOne({_id:id}).populate('category').populate('subCategory');
        
        const error=req.session.proeditErr
        if(error){
            delete req.session.proeditErr
        }
        res.render('./admin/edit-product', { product, categories,error });
    } catch (err) {
        res.redirect('/admin/error');
    }
};




const editProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    
    const result = await products.updateOne(
      { _id:id }, 
      {
        $set: {
          category: req.body.category,
          subCategory: req.body.subCategory,
          name: req.body.product_name,
          price: req.body.price,
          stock: req.body.stock,
          brand: req.body.brand,
          description: req.body.description,
        },
      }
    );
    if (result) { 
      res.redirect('/admin/products-list');
    } else {
      req.session.proeditErr = 'Something went wrong';
      res.redirect(`/admin/editProduct/${id}`);
    }
  } catch (err) {
    res.redirect('/admin/error');
  }
};


const deleteProduct=async(req,res,next)=>{
    try{
        const id=req.params.id
        const proDelete=await products.updateOne({_id:id},{$set:{delete:true}});
        if(proDelete){
            res.redirect('/admin/products-list')
        }else{
            req.session.proErr="something went wrong";
            res.redirect('/admin/products-list')
        }
    }catch(err){
        res.redirect('/admin/error')
    }
}

const restoreProduct=async(req,res,next)=>{
    try{
        const id=req.params.id
        const proRestore=await products.updateOne({_id:id},{$set:{delete:false}});
        if(proRestore){
            res.redirect('/admin/products-list')
        }else{
            req.session.proErr="something went wrong"
            res.redirect('/admin/products-list')
        }
    }catch(err){
        res.redirect('/admin/error')
    }
}

module.exports={addProduct,getProduct,editImage,editPage,editProduct,deleteProduct,restoreProduct}