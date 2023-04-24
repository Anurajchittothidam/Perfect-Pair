const user=require('../modal/users')

const adminLogin=(req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin/dashboard');
    }else{
        next()
    }
}

let adminSession=(req,res,next)=>{
    if(req.session.admin){
        next();
    }else{
        res.redirect('/admin/');
    }
}

const userSession=(req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.redirect('/login');
    }
}

const userhaveSession=(req,res,next)=>{
    if(req.session.user){
        
        res.redirect('/')
    }else{
        next()
    }
}


const isBlocked=async(req,res,next)=>{
    if(req.session.user){
        const users=await user.findById({_id:req.session.user})
        if(users){
            if(users.isBlocked===true){
                req.session.user=null
                req.session.logErr="Your Email Id blocked"
                res.redirect('/login');
            }else{
                next()
            }
        }else{
            next()
        }
    }else{
        next()
    }
      
       
    }


module.exports={adminSession,adminLogin,userSession,userhaveSession,isBlocked}


