const express=require('express');
const router=express.Router();
const {userSession,userhaveSession,isBlocked,logedIn}=require('../middleware/session')
const userController=require('../controllers/userControllers');
const wishlistController = require('../controllers/wishlistController');
const cartController=require('../controllers/cartController')
const checkOutController=require('../controllers/checkOutController')
const orderController=require('../controllers/orderController')
const users = require('../modal/users');

router.get('/',isBlocked,userController.landingPage)

router.get('/login',userhaveSession,userController.renderLogin)

router.get('/register',userhaveSession,userController.renderSignUp)

router.post('/postRegister',userhaveSession,userController.registerUser)

router.post('/login',userhaveSession,userController.loginUser)

router.get('/Otp',userhaveSession,userController.renderOTP)

router.post('/verifyOTP',userhaveSession,userController.verifyOTP)

router.post('/resendOtp',userhaveSession,userController.resendOtp)

router.get('/forgotPass',userhaveSession,userController.renderforgot)

router.post('/forgotPass',userhaveSession,userController.forgotPassword)

router.get('/forgotOtp',userhaveSession,userController.forgotOtp)

router.post('/verifyForgot',userhaveSession,userController.verifyForgot)

router.get('/shop',isBlocked,userController.renderCategory)


router.get('/product-detailed/:id',isBlocked,userController.renderSingleProduct)

router.get('/wishlist',userSession,isBlocked,wishlistController.viewWishlist)

router.get('/wishList/:id',isBlocked,wishlistController.addToWishList)

router.post('/removeFromWishList',userSession,isBlocked,wishlistController.removeFromWishList)

router.get('/addToCart',isBlocked,cartController.addToCart)

router.get('/cart',userSession,isBlocked,cartController.viewCart)

router.post('/changeQuantity',userSession,isBlocked,cartController.changeQuantity)

router.post('/removeFromCart',userSession,isBlocked,cartController.removeFromCart)

router.get('/checkOut',userSession,isBlocked,checkOutController.renderCheckout)

router.get('/addAddress',isBlocked,userSession,checkOutController.renderaddAddress)

router.post('/addAddress',isBlocked,userSession,checkOutController.addAddress)

// router.post('firstAddress',isBlocked,userSession,checkOutController.firstAddress)

router.post('/editAddress/:id',isBlocked,userSession,checkOutController.editAddress)

router.post('/removeAddress',isBlocked,userSession,checkOutController.removeAddress)

router.post('/verifyCoupon',isBlocked,userSession,checkOutController.verifyCoupon)

router.post('/placeOrder',isBlocked,userSession,orderController.placeOrder)

router.post('/verifyPayment',isBlocked,userSession,orderController.verifyPayment)

router.get('/paymentFailed',isBlocked,userSession,orderController.paymentFailed)

router.get('/orderSuccess/:id',userSession,isBlocked,orderController.renderOrderSuccess)

router.get('/orderDetailed/:id',isBlocked,userSession,orderController.renderOrderSuccess)

router.get('/profile',isBlocked,userSession,userController.renderProfile)

router.get('/orders',isBlocked,userSession,orderController.renderOrders)

router.get('/profile/addAddress',isBlocked,userSession,checkOutController.renderaddAddress)

router.post('/cancelOrder',isBlocked,userSession,orderController.cancelOrder)

router.post('/editProfile',isBlocked,userSession,userController.editProfile)

router.post('/editPassword',isBlocked,userSession,userController.changePassword)

router.get('/contact',isBlocked,userController.renderContact)

router.get('/error',(req,res)=>{
    const currentPath=req.path
    res.render('./admin/error',{currentPath})
})

router.get('/logOut',userController.logOut)

module.exports=router