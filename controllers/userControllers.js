const users=require('../modal/users');
const products=require('../modal/products')
const categories=require('../modal/categories')
const wishlist=require('../modal/wishlist')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer');
const userOTPVerification=require('../modal/userOTPVerification');
const product = require('../modal/products');
const address = require('../modal/address');
const coupon=require('../modal/coupon');
const session = require('express-session');
require('dotenv').config()

const transporter =nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS 
    }
})
const userController={
    renderLogin:(req,res)=>{
        try{
            const error=req.session.logErr;
            const logedIn=req.session.user;
            if(error){
                delete req.session.logErr
            }
            res.render('./users/login',{error,logedIn})
        }catch(err){
            res.redirect('/error')
        }
    },
    loginUser:async(req,res)=>{
        try{
            const {email,password}=req.body;
            const user=await users.findOne({email:email})
            if(user){
                if(user.isBlocked===false){
                    bcrypt.compare(password,user.password).then((result)=>{
                        if(result){
                            req.session.user=user._id;
                            res.redirect('/');
                        }else{
                            req.session.logErr="Incorrenct Password"
                            res.redirect('/login')
                        }
                    })
                }else{
                    req.session.logErr="Your email Id blocked"
                    res.redirect('/login')
                } 
            }else{
                req.session.logErr="Incorrect Email"
                res.redirect('/login');
            }
        }catch(err){
            res.redirect('/error')
        }
    },
    renderSignUp:(req,res)=>{
        try{
            error=req.session.signErr
            const logedIn=req.session.user;
            if(error){
                delete req.session.signErr
            }
            res.render('./users/register',{error,logedIn})
        }catch(err){
            res.redirect('/error')
        }
    },
    registerUser:async (req,res)=>{
        try{
            const existingEmail=await users.findOne({email:req.body.email})
            if(existingEmail){
                req.session.signErr="This email alredy exist"
                res.redirect('/register');
            }
            const hashPassword=await bcrypt.hash(req.body.password,10)
            const User={
                name:req.body.name,
                email:req.body.email,
                password:hashPassword,
                phonenumber:req.body.phoneNumber
            }

            const OTP = Math.floor(1000 + Math.random() * 9000).toString();
            const expirationTime = new Date(Date.now() + 5 * 60 * 1000)
            await userOTPVerification.deleteMany({email:User.email});

            const newOTPVerification=new userOTPVerification({
                email:User.email,
                otp:OTP,
                expiresAt:expirationTime
            })

            await newOTPVerification.save();

            const mailOptions = {
                from: 'perfectpair@gmail.com',
                to: User.email,
                subject: 'OTP',
                text: `You otp :${OTP}`,
                html: `
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Perfect Pair</a>
                </div>
                <p style="font-size:1.1em">Hi ${User.name},</p>
                <p>Thank you for choosing Perfect Pair. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Bookworm</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Perfect Pair</p>
                </div>
                </div>
                </div>`
              };

              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error(`Error sending email: ${error}`);
                }else{
                    console.log(`OTP sent to ${User.email}: ${OTP}`);
                    req.session.userInfo={
                        name:User.name,
                        email:User.email,
                        phoneNumber:User.phonenumber,
                        password:User.password,
                        expiresAt:expirationTime
                    }
                    res.redirect('/Otp');
                    // ?name=${User.name}&email=${User.email}&phoneNumber=${User.phonenumber}&password=${User.password}&expiresAt=${expirationTime}
                }    
              });
        }catch(err){
            res.redirect('/error')
        }
    },
    renderOTP:(req,res)=>{
        try{
            const userInfo=req.session.userInfo
            const error=req.session.OtpErr;
            const logedIn=req.session.user;
            if(error){
                delete req.session.OtpErr
            }
            res.render('./users/Otp',{userInfo,error,logedIn})
        }catch(err){
            res.redirect('/error')
        }
    },
    verifyOTP:async(req,res)=>{
        try{
            const userOtp=await userOTPVerification.findOne({email:req.body.email})
            const userInfo={
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                phonenumber:req.body.phoneNumber,
                expiresAt:req.body.expirationTime
            }
            if(req.body.Otp===userOtp.otp){
                const date=new Date(Date.now())
                if(date<userOtp.expiresAt){
                    const newUser=new users({
                       username:userInfo.name,
                       email:userInfo.email,
                       password:userInfo.password,
                       phonenumber:userInfo.phonenumber,
                       isBlocked:false 
                    })
                    await newUser.save();
                    await userOTPVerification.deleteOne({email:req.body.email})

                    const userdb=await users.findOne({email:req.body.email})
                    req.session.user=userdb._id;
                    res.redirect('/');
                }else{
                    req.session.OtpErr="OTP time expired"
                    res.redirect('/Otp')
                }
            }else{
                req.session.OtpErr="Invalid Otp"
                res.redirect('/Otp');
            }
        }catch(err){
            res.redirect('/error');
        }
    },
    resendOtp:async(req,res)=>{
        try{
            const hashPassword=await bcrypt.hash(req.body.password,10)
            const User={
                name:req.body.name,
                email:req.body.email,
                password:hashPassword,
                phonenumber:req.body.phoneNumber
            }

            const OTP = Math.floor(1000 + Math.random() * 9000).toString();
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const expirationTime = new Date(Date.now() + 5 * 60 * 1000).toLocaleDateString(undefined, options);
            await userOTPVerification.deleteMany({email:User.email});

            const newOTPVerification=new userOTPVerification({
                email:User.email,
                otp:OTP,
                expiresAt:expirationTime
            })

            await newOTPVerification.save();

            const mailOptions = {
                from: 'perfectpair@gmail.com',
                to: User.email,
                subject: 'OTP',
                text: `You otp :${OTP}`,
                html: `
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Perfect Pair</a>
                </div>
                <p style="font-size:1.1em">Hi ${User.username},</p>
                <p>Thank you for choosing Perfect Pair. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Bookworm</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Perfect Pair</p>
                </div>
                </div>
                </div>`
              };

              await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error(`Error sending email: ${error}`);
                }else{
                    console.log(`OTP sent to ${User.email}: ${OTP}`);
                    res.redirect('/Otp');
                }    
              });
        }catch(err){
            res.redirect('/error')
        }
    },
    logOut:(req,res)=>{
        try{
            req.session.user=null;
            res.redirect('/');
        }catch(err){
            res.redirect('/error')
        }
    },
    renderforgot:(req,res)=>{
        try{
            const error=req.session.forErr;
           const logedIn=req.session.user;
           if(error){
            delete req.session.forErr
           }
            res.render('./users/forgotPass',{error,logedIn});
        }catch(err){
            res.redirect('/error')
        }
    },
    forgotPassword:async(req,res)=>{
        try{
            const emailExist=await users.findOne({email:req.body.email})
            if(emailExist){
                const hashpassword=await bcrypt.hash(req.body.newPassword,10)
            const User={
                email:req.body.email,
                password:hashpassword,
            }

            const OTP=Math.floor(1000+Math.random()*9000).toString();
            const expirationTime=new Date(Date.now()+5*60*1000)
            await userOTPVerification.deleteMany({email:User.email})

            const newOTPVerification= new userOTPVerification({
                email:User.email,
                otp:OTP,
                expiresAt:expirationTime
            })

            await newOTPVerification.save();

            const mailOptions={
                fom:'perfectpairshe2023',
                to:User.email,
                subject: 'OTP',
                text: `You otp :${OTP}`,
                html: `
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Perfect Pair</a>
                </div>
                <p style="font-size:1.1em">Hi ${User.username},</p>
                <p>Thank you for choosing Perfect Pair. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Bookworm</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Perfect Pair</p>
                </div>
                </div>
                </div>`
            }

            await transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    console.log(`Error occured while sending mail ${error}`)
                }else{
                    console.log(`OTP sent to ${User.email}:${OTP}`)
                    req.session.userInfo={
                        email:User.email,
                        password:User.password,
                        expiresAt:expirationTime
                    }
                    res.redirect('/forgotOtp')
                }
            })
            }else{
                req.session.forErr="Your Email not found SignUp to continue"
                res.redirect('/forgotPass')
            }
        }catch(err){
            res.redirect('/error')
        }
    },
    forgotOtp:(req,res)=>{
        try{
            const userInfo=req.session.userInfo
            const error=req.session.forErr;
            const logedIn=req.session.user;
            if(error){
                delete req.session.forErr
            }
            res.render('./users/forgotOtp',{userInfo,error,logedIn})
        }catch(err){
            res.redirect('/error')
        }
    },
    verifyForgot:async(req,res)=>{
        try{
            const userOtp=await userOTPVerification.findOne({email:req.body.email})
            const userInfo={
                email:req.body.email,
                password:req.body.password,
            }
            if(req.body.Otp===userOtp.otp){
                const date=new Date(Date.now())
                if(date<userOtp.expiresAt){
                    const newPass = await users.updateOne({ email: userInfo.email }, { $set: { password: userInfo.password } })
                    await userOTPVerification.deleteOne({ email: req.body.email })
                    
                    if (newPass) {
                      try {
                        const userdb = await users.findOne({ email: req.body.email  })
                        req.session.user = userdb._id
                        res.redirect('/')
                      } catch (err) {
                        res.redirect('/error')
                      }
                    } else {
                      req.session.forErr = "something went wrong"
                      res.redirect('/forgotOtp')
                    }
                }else{
                    req.session.forErr="OTP time expired"
                    res.redirect('/forgotOtp')
                }
            }else{
                req.session.forErr="Invalid Otp"
                res.redirect('/forgotOtp');
            }
        }catch(err){
            res.redirect('/error')
        }
    },
    landingPage:async(req,res)=>{
        try{
            const product=await products.find({delete:false})
             const session=req.session.user
            const logedIn=await users.findOne({_id:session})
           
            res.render('./users/dashboard',{logedIn,product})
        }catch(err){
            res.redirect('/error');
        }
    },

    renderCategory:async(req,res)=>{
        try{
       
        const category = await categories.find({ delete: false });
        const All=[]
        All.push(...category)
        const categoryId=req.query.category || All

        const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 3
          const skip = (page - 1) * limit;
          const Input=req.query.search || ""
             
          const sortOption = req.query.sort;
          let sort = [];
          const productses=await products.find({delete:false}).populate('category')
          if (sortOption === "low-to-high") {
            sort.push(["price", 1]);
          } else if (sortOption === "high-to-low") {
            sort.push(["price", -1]);
          } else if (sortOption === "ascending") {
            sort.push(["name", 1]);
            productses.sort((a, b) => a.name.localeCompare(b.name));
          } else if (sortOption === "descending") {
            sort.push(["name", -1]);
            productses.sort((a, b) => b.name.localeCompare(a.name));
          }
      
          const product = await products
          .find({
            delete: false,
          }).find({  category:{$in:categoryId}, delete: false })
          .find({name:new RegExp(Input,"ig")})
          .populate("category")
          .sort(sort)
          .skip(skip)
          .limit(limit);
        
      
          const count = await products
          .find({
            delete: false,
          }).find({  category: categoryId, delete: false })
          .find({name:new RegExp(Input,"ig")})
          .populate("category")
          .sort(sort)
          .count()
          let totalPages
          if(count%3==0){
             totalPages = Math.floor(count / limit)
          }else{
            totalPages = Math.floor(count/limit)+1
          }
         
          const pageNumbers = [];
          for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
          const user = req.session.user;
          
          const productCount = count
         
          const session=req.session.user
          const logedIn=await users.findOne({_id:session})
          const pro=await products.find({delete:false})
          if (count <= limit && page > 1) {
            // Redirect to first page
            return res.redirect(`/shop?page=1&limit=${limit}&category=${categoryId}&sort=${sortOption}&search=${Input}`);
          }else{
            res.render("./users/productCategory", {
                user,
                logedIn,
                limit,
                categoryId,
                product,
                category,
                sortOption,
                productCount,
                Input,
                pro,
                page,
                totalPages,
                pageNumbers,
              });
          }
          
        } catch (error) {
          console.log(error);
          res.redirect('/error')
        }
    },
    

    renderSingleProduct:async(req,res)=>{
        try{
            const id=req.params.id
            const product=await products.findOne({_id:id}).populate('category')
            const similar=await products.find({category:product.category._id,delete:false})
            const session=req.session.user
            const logedIn=await users.findOne({_id:session})
            res.render('./users/singleProduct',{product,logedIn,similar})
        }catch(err){
            res.redirect('/error')
        }
    },
   renderProfile:async(req,res)=>{
    try{
        const session=req.session.user
        const logedIn=await users.findOne({_id:session})
        const user=await users.findOne({_id:session})
        let message=req.session.chaErr
        delete req.session.chaErr
        res.render('./users/profile',{logedIn,user,message})
    }catch(err){
        res.redirect('/error')
    }
   },
   editProfile:async(req,res)=>{
    try{
        const session=req.session.user
        await users.updateOne({_id:session},{
            $set:{username:req.body.fullName,email:req.body.email,phonenumber:req.body.phoneNumber}
        })
        res.redirect('/profile')
    }catch(err){
        res.redirect('/error')
    }
   },
   changePassword:async(req,res)=>{
    try{
        const data=req.body
        const session=req.session.user
        if(data.newPassword===data.confirmPassword){
            const userData=await users.findOne({_id:session})
            const passwordMatch=await bcrypt.compare(data.currentPassword,userData.password)
            if(passwordMatch){
                const hashPassword = await bcrypt.hash(data.newPassword, 10)
                await users.updateOne({_id:session},
                    {$set:{password:hashPassword}}).then(()=>{
                        req.session.user=null
                        res.redirect('/login')
                    })
            }else{
                req.session.chaErr="Current Password and new Password not matching"
                res.redirect('/profile')
            }
        }else{
            req.session.chaErr="New Password and Confirm Password not matching"
            res.redirect('/profile')
        }
    }catch(err){
        res.redirect('/error')
    }
   },
   renderContact:async(req,res)=>{
    try{
        const session=req.session.user
            const logedIn=await users.findOne({_id:session})
        res.render('./users/contact',{logedIn})
    }catch(err){
        res.redirect('/error')
    }
   }
   
}


module.exports=userController;