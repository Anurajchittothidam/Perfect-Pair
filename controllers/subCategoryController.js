const subCategory=require('../modal/subCategories');

const addSubCategory=async(req,res)=>{
    try{
        if(req.body.name){
            const {name}=req.body;
        const subCategoryExist=await subCategory.findOne({subCategory_name:name})
        if(subCategoryExist){
            req.session.subExist='This subCategory alredy exist'
            return res.redirect('/admin/subCategory');
        }else{
            const subCategories=new subCategory({
                subCategory_name:name
            })
            await subCategories.save();
            res.redirect('/admin/subCategory')
        }
        }else{
            req.session.subExist="Enter the subCategory name first"
            res.redirect('/admin/subCategory')
        }
       
    }catch(err){
        res.redirect('/admin/error')
    }
}

const getSubCategory=async(req,res)=>{
    try{
        const subCategories=await subCategory.find()
        let index=0;
        const message=req.session.subExist
        if(message){
            delete req.session.subExist
        }
        res.render('./admin/subcategory',{subCategories,index,message})
    }catch(err){
        res.redirect('/admin/error')
    }
}

const editSubCategory=async(req,res)=>{
    try{
        if(req.body.name.trim()){
            const name = req.body.name
            const id = req.params.id;
            const subCategoryExist=await subCategory.findOne({subCategory_name:name})
            if(subCategoryExist){
                req.session.subExist='This subCategory alredy exist'
                return res.redirect('/admin/subCategory');
            }else{
                await subCategory.updateOne({_id:id},{$set:{subCategory_name:name}})
                res.redirect("/admin/subCategory")
            }
        }else{
            req.session.subExist="subCategory name is required"
            res.redirect("/admin/subCategory")
        }
    }catch(err){
        res.redirect('/admin/error')
    }
}

const deleteSubCategory=async(req,res)=>{
    try{
        const id=req.params.id;
        const subdelete = await subCategory.updateOne({_id:id},{$set:{delete:true}})
        if(!subdelete){
            req.session.subExist='something went wrong'
            res.redirect('/admin/subCategory')
        }else{
            res.redirect('/admin/subCategory')
        }
        
    }catch(err){
        res.redirect('/admin/error')
    }
}

const restoreSubCategory=async (req,res)=>{
    try{
        id=req.params.id;
        const restoreSub=await subCategory.updateOne({_id:id},{$set:{delete:false}})
        if(restoreSub){
            res.redirect("/admin/subCategory")
        }else{
            req.session.subExist="something went wrong"
            res.redirect('/admin/subCategory')
        }
    }catch{
        res.redirect('/admin/error')
    }
}

module.exports={addSubCategory,getSubCategory,editSubCategory,deleteSubCategory,restoreSubCategory}