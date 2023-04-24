const users=require('../modal/users')

const findUsers=async(req,res,next)=>{
    try{
        const user=await users.find()
        if(!user){
            req.session.userErr="users not found";
            res.redirect('/admin/users');
        }else{
            let index=0;
            const message=req.session.userErr;
            if(message){
                delete req.session.userErr
            }
            res.render('./admin/users',{user,index,message})
        }
    }catch(err){
       res.redirect('/admin/error')
    }
}

const deleteUser=async (req,res,next)=>{
    try{
        const id=req.params.id;
        const delUser=await users.updateOne({_id:id},{$set:{isBlocked:true}});
        if(delUser){
            res.redirect('/admin/users');
        }else{
            req.session.userErr='something went wrong'
            res.redirect('/amin/users')
        }  
    }catch(err){
       res.redirect('/admin/error')
    }
}

const restoreUser=async (req,res,next)=>{
    try{
        const id=req.params.id;
        await users.updateOne({_id:id},{$set:{isBlocked:false}});
        res.redirect("/admin/users")
    }catch(err){
       res.redirect('/admin/error')
    }
}

module.exports={findUsers,deleteUser,restoreUser}