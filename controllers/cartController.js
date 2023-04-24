const products=require('../modal/products')
const user=require("../modal/users")
const mongoose = require('mongoose');
const cart=require('../modal/cart')


const cartController={
    addToCart:async(req,res)=>{
        try{
            const Id=req.query.productId;
            const session=req.session.user
            if(req.session.user){
                const size=req.query.size
                const proObj={
                    productId:Id,
                    size:size,
                    quantity:1
                } 
                const userCart=await cart.findOne({userId:session})
                if(userCart){
                    let productExist=userCart.product.findIndex(
                        (product)=> product.productId==Id
                    )
                    if(productExist !=-1){//if product exitst 
                        await cart.aggregate([
                            {$unwind:'$product'},
                        ])
                       

                        let sameSizeExist = userCart.product.find(
                            (product) => product.productId == Id && product.size == size
                          );
                          if (sameSizeExist) { // if same product with the same size exists
                            await cart.updateOne(
                              { userId: session, 'product.productId': Id },
                              { $inc: { 'product.$.quantity': 1 } }
                            ).then(() => {
                              res.json({ status: true });
                            });
                          } else { // if same product with the same size does not exist
                            await cart.updateOne(
                              { userId: session },
                              { $push: { product: proObj } }
                            ).then(() => {
                              res.json({ status: true });
                            });
                          }
                          
                        
                    }else{//if product not exist update the product to the userId
                        await cart.updateOne({userId:session},{$push:{product:proObj}}).then(()=>{
                            res.json({status:true})
                        })
                    }
                }else{//if there is no cart for this user
                    const newCart=new cart({
                        userId:session,
                        product:[
                            {
                                productId:Id,
                                quantity:1,
                                size:Number(size)
                            }
                        ]
                    })
                    await newCart.save().then(()=>{
                        res.json({status:true})
                    })
                }
    
            }else{
                res.json({ redirectUrl: '/login' });
            }
            
        }catch(err){
            res.redirect('/error')
        }
    },
    viewCart:async(req,res)=>{
        try{
            const session=req.session.user
                const cartData=await cart.aggregate([
                    {$match: { userId:new mongoose.Types.ObjectId(req.session.user)}},
                    {$unwind:'$product'},
                    {$project:
                        {productItem:"$product.productId",
                         productQuantity:"$product.quantity"
                        }
                    },
                    {$lookup:{
                        from:"products",
                        localField:"productItem",
                        foreignField:"_id",
                        as:"productDetails"
                    }},
                    { $project: {
                        productQuantity:1,
                        cartId:"$_id",
                        _id: "$productDetails._id",
                        name: "$productDetails.name",
                        price: "$productDetails.price",
                        size:"$productDetails.size",
                        image: { $arrayElemAt: ["$productDetails.image.path", 0] },
                        productDetails:{$arrayElemAt: ["$productDetails", 0]},
                        quantity:"$productQuantity"
                    }},
                    {$addFields:{
                        productPrice:{
                            $multiply:["$productQuantity","$productDetails.price"]
                        }
                    }},                      
                ]).exec()
                const countInCart = cartData.length;
                const sum=cartData.reduce((accumulator,object)=>{
                    return accumulator+object.productPrice
                },0)
                const logedIn=await user.findOne({_id:session})

                res.render('./users/cart',{cartData,sum,countInCart,logedIn})
        }catch(err){
            res.redirect('/error')
        }
    },
    changeQuantity:async(req,res)=>{
        try{
            const data=req.body
            const cartId=data.cartId
            if(data.count==-1 && data.quantity==1){
                await cart.updateOne({_id:cartId,'product.productId':data.productId,'product.size':data.size},{$pull:{product:{productId:data.productId}}}).then(()=>{
                    res.json({quantity:true})
                })
            }else{
                await cart.updateOne({
                    _id:cartId,'product.productId':data.productId
                },{$inc:{'product.$.quantity':data.count}})
                .then(async()=>{
                    const cartData=await cart.aggregate([
                        {$match:{_id:cartId}},
                        {$unwind:'$product'},
                        {$project:{
                            productQuantity:'$product.quantity',
                            productItem:'$product.productId'
                        }},
                        {$lookup:
                            {from:'product',
                            localField:'productItem',
                            foreignField:'_id',
                            as:'productDetails'
                            }
                        },
                        {$project:{
                            productQuantity:1,
                            cartId:"$_id",
                        _id: "$productDetails._id",
                        productDetails:{$arrayElemAt: ["$productDetails", 0]},
                        quantity:"$productQuantity"
                        }},
                        {$addFields:{
                            productPrice:{
                                $multiply:['$productQuantity','$productDetails.price']
                            }
                        }},
                    ])
                    const sum=cartData.reduce((accumulator,object)=>{
                        return accumulator+object.productPrice
                    },0)
                    res.json({success:true,cartData,sum})
                })
            }
        }catch(err){
            res.redirect('/error')
        }
    },
    removeFromCart:async(req,res)=>{
        try{
            const productId=req.body.productId
            const cartId=req.body.cartId
            const size=req.body.size
            await cart.aggregate([
                {$unwind:"$product"}
            ])
            await cart.updateOne({
                _id:cartId,'product.productId':productId,'product.size':size
            },{$pull:{product:{productId:productId}}}).then(()=>{
                res.json({status:true})
            })
        }catch(err){
            res.redirect('/error')
        }
    }
}


module.exports=cartController