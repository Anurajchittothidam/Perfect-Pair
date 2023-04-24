const categories = require("../modal/categories");
const coupon=require('../modal/coupon')
const order=require('../modal/order')
const mongoose=require('mongoose')
const moment = require("moment");
const users = require("../modal/users");
const product=require('../modal/products')

const adminController={
    adminLoginPage:(req,res)=>{
        try{
            const error=req.session.loginErr;
            if(error){
                delete  req.session.loginErr
            }
            res.render('./admin/adminLogin',{error})
        }catch(err){
            res.redirect('/admin/error')
        }
    },
    adminPostLogin:(req,res,next)=>{
        try{
            const {password,username}=req.body;
            const passwordDB=process.env.PASSWORD
            const usernameDB=process.env.USERNAME
            if(password===passwordDB && username===usernameDB){
                req.session.admin=req.body.username
                res.redirect('/admin/dashboard')
            }else{
                req.session.loginErr='User Name or Password is incorrect'
                res.redirect('/admin/')
            }
        }catch(err){
            res.redirect('/admin/error')

        }
    },
    getAddProductPage:async(req,res,next)=>{
        try{
            const error=req.session.addProErr;
            const category=await categories.find()
            if(error){
                delete req.session.addProErr
            }
            res.render('./admin/add-product',{category,error})
        }catch(err){
            res.redirect('/admin/error')

        }
    },
    renderCoupon:async(req,res,next)=>{
        try{
            const coupons=await coupon.find()
            const message=req.session.coupErr
            let index=0;
            res.render('./admin/coupon',{coupons,message,index})
        }catch(err){
            res.redirect('/admin/error')

        }
    },
    addCoupon:async(req,res,next)=>{
        try{
            if(req.body){
                const data=req.body
                const newCoupon=new coupon({
                    name:data.name,
                    discount:data.discount,
                    maxLimit:data.maxLimit,
                    minLimit:data.minLimit,
                    date:data.date
                })
                await newCoupon.save()
                res.redirect('/admin/coupon')
            }else{
                req.session.coupErr="Enter the complete fields"
                res.redirect('/admin/coupon')
            }
            
            
        }catch(err){
            res.redirect('/admin/error')

        }
    },
    editCoupon:async(req,res,next)=>{
        try{
            const id=req.params.id
            const data=req.body
            await coupon.updateOne({_id:id},{$set:{
                name:data.name,
                discount:data.discount,
                maxLimit:data.maxLimit,
                minLimit:data.minLimit,
                date:data.date}})
                res.redirect('/admin/coupon')
        }catch(err){
            res.redirect('/admin/error')

        }
    },
    deleteCoupon:async(req,res,next)=>{
        try{
            const id=req.params.id
            await coupon.updateOne({_id:id},{$set:{delete:true}})
            res.redirect('/admin/coupon')
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    restoreCoupon:async(req,res,next)=>{
        try{
            const id=req.params.id
            await coupon.updateOne({_id:id},{$set:{delete:false}})
            res.redirect('/admin/coupon')
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    adminLogOut:(req,res,next)=>{
        try{
            req.session.admin=null;
            res.redirect('/admin/');
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    orderDetail:async(req,res,next)=>{
        try{
            const id=req.params.id
            const orderDetailed=await order.findOne({_id:new mongoose.Types.ObjectId(id)})
            const orderData=await order.aggregate([
                {$match:{_id:new mongoose.Types.ObjectId(id)}},
                {$unwind:"$orderItems"},
                {$project:{
                    productItem:'$orderItems.productId',
                    productQuantity:'$orderItems.quantity',
                    productSize:'$orderItems.size',
                }},
                {
                    $lookup: {
                      from: "products",
                      localField: "productItem",
                      foreignField: "_id",
                      as: "productDetails",
                    },
                  },
                  {
                    $project: {
                      productQuantity: 1,
                      name: "$productDetails.name",
                      price: "$productDetails.price",
                      size: "$productDetails.size",
                      image: { $arrayElemAt: ["$productDetails.image.path", 0] },
                      productDetails: { $arrayElemAt: ["$productDetails", 0] },
                      quantity: "$productQuantity",
                    },
                  },
                  {$addFields:{
                    productPrice:{
                        $multiply:["$productQuantity","$productDetails.price"]
                    }
                }},   
            ])
            const sum=orderData.reduce((accumulator,object)=>{
                return accumulator+object.productPrice
            },0)
          
            let price;
          orderData.forEach(order=>{
            price=order.price
          })
           

            res.render('./admin/orderDetailed',{orderData,orderDetailed,price,sum})

        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    renderOrders:async(req,res,next)=>{
        try{
            const orders=await order.find().sort({createdAt:-1})
           
            res.render('./admin/orders',{orders})
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    orderStatusChange:async(req,res,next)=>{
        try{
            const id=req.params.id
            const paystat=req.body.paymentStatus
            const ordstat=req.body.orderStatus
            await order.updateOne({_id:id},{$set:{paymentStatus:paystat,orderStatus:ordstat}})
            res.redirect('/admin/orders')

        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    renderDashboard:async(req,res,next)=>{
        const orders=await order.find({orderStatus: { $ne: "cancelled" } }).sort({createdAt:-1})
        const totalRevenue = orders.reduce((accumulator, object) => {
            return accumulator + object.totalAmount;
        }, 0);
        const todayOrder = await order.find({
            orderDate: moment().format("MMM Do YY"),
        });
        const todayRevenue = todayOrder.reduce((accumulator, object) => {
            return accumulator + object.totalAmount;
        }, 0);
        const start = moment().startOf("month");
        const end = moment().endOf("month");
        const oneMonthOrder = await order.find({ orderStatus: { $ne: "cancelled" }, createdAt: { $gte: start, $lte: end }, })
        const monthlyRevenue = oneMonthOrder.reduce((accumulator, object) => {
            return accumulator + object.totalAmount
        }, 0);
        const allOrders = orders.length;
        const pending = await order.find({ orderStatus: "pending" }).count();
        const shipped = await order.find({ orderStatus: "shipped" }).count();
        const delivered = await order.find({ orderStatus: "delivered" }).count();
        const cancelled = await order.find({ orderStatus: "cancelled" }).count();
        const cod = await order.find({ paymentMethod: "COD" }).count();
        const online = await order.find({ paymentMethod: "Online" }).count();
        const activeUsers = await users.find({ isBlocked: false }).count();
        const products = await product.find({ delete: false }).count();
        let a=0;
        res.render('./admin/dashboard', { orders,a,cod, online, pending, shipped, delivered, cancelled, totalRevenue, allOrders, activeUsers, products, monthlyRevenue, todayRevenue });
    },
    salesReport:async(req,res,next)=>{
        try{
            const orders=await order.find({orderStatus:"delivered",paymentStatus:"paid"}).sort({createdAt:-1})
            let a=0;
            res.render('./admin/salesReport',{orders,a})
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    salesReportDaily:async(req,res,next)=>{
        try{
         
            const orders = await order.find({
              $and: [
                { orderStatus: "delivered", paymentStatus: "paid" },
               { deliveryDate: moment().format("MMM Do YY")}
              ]
            })
            
            let a=0;
            res.render('./admin/salesReport',{orders,a})            
        }catch(err){
                        res.redirect('/admin/error')
        }
    },
    salesReportMonthly:async(req,res,next)=>{
        try{
            let d = new Date();
            d.setMonth(d.getMonth() - 1);
            const orders=await order.find({
                $and:[
                    {orderStatus:"delivered",paymentStatus:"paid"},
                    {createdAt:{$gte:d}}
                ]
            })
            let a=0;
            res.render('./admin/salesReport',{orders,a})
        }catch(err){
                        res.redirect('/admin/error')
        }
    }
}
   

 



module.exports=adminController;