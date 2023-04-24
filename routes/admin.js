const express=require('express');
const router=express.Router();
const categories=require("../modal/categories")
const adminController=require('../controllers/adminController');
const {adminLogin,adminSession}=require('../middleware/session')
const categoryController=require('../controllers/categoryController')
const {addSubCategory,getSubCategory,editSubCategory,deleteSubCategory,restoreSubCategory}=require('../controllers/subCategoryController')
const {addProduct,getProduct,editImage,editPage,editProduct,deleteProduct,restoreProduct}=require('../controllers/productControllers')
const {findUsers,deleteUser,restoreUser}=require('../controllers/adminUserControllers')
const upload=require('../middleware/uploadImage');
require('dotenv').config();

router.get('/',adminLogin,adminController.adminLoginPage)



router.post('/login',adminController.adminPostLogin)

router.get('/dashboard',adminSession,adminController.renderDashboard)

// router.get('/product',adminSession,(req,res)=>{
//     res.render('./admin/product')
// })

router.get('/add-product',adminSession,adminController.getAddProductPage)

router.get('/users',adminSession,findUsers)


router.get('/category',adminSession,categoryController.findAllCategory)

router.post('/addCategory',categoryController.addCategory)

router.get('/subCategory',adminSession,getSubCategory)

router.post('/addSubCategory',adminSession,addSubCategory)

router.post('/editSubCategory/:id',adminSession,editSubCategory)

router.post('/deleteSubCategory/:id',adminSession,deleteSubCategory)



router.post('/editCategory/:id',adminSession,categoryController.editCategory)

router.post('/editsubCat/:id',adminSession,categoryController.editsubCat)

router.post('/deleteCategory/:id',adminSession,categoryController.deleteCategory)

router.post('/restoreCategory/:id',adminSession,categoryController.restoreCategory)

router.post('/restoreSubCategory/:id',adminSession,restoreSubCategory)

router.post('/delete-user/:id',adminSession,deleteUser)

router.post('/restore-user/:id',adminSession,restoreUser)

router.post('/addProduct',upload.array('myFiles',3),adminSession,addProduct)

router.post('/getSubCategories',adminSession,categoryController.getSubCategories)

router.get('/products-list',adminSession,getProduct)

router.post('/editProduct/:id/:imageId',upload.single('myFiles'),adminSession,editImage)

router.get('/editPage/:id',adminSession,editPage)

router.post('/editProduct/:id',adminSession,editProduct)

router.post('/deleteProduct/:id',adminSession,deleteProduct)

router.post('/restoreProduct/:id',adminSession,restoreProduct)

router.get('/coupon',adminSession,adminController.renderCoupon)

router.post('/addCoupon',adminSession,adminController.addCoupon)

router.post('/editCoupon/:id',adminSession,adminController.editCoupon)

router.post('/deleteCoupon/:id',adminSession,adminController.deleteCoupon)

router.post('/restoreCoupon/:id',adminSession,adminController.restoreCoupon)

router.get('/orderDetailed/:id',adminSession,adminController.orderDetail)

router.get('/orders',adminSession,adminController.renderOrders)

router.post('/orderStatusChange/:id',adminSession,adminController.orderStatusChange)

router.get('/salesReport',adminSession,adminController.salesReport)

router.get('/salesReportDaily',adminSession,adminController.salesReportDaily)

router.get('/salesReportMonthly',adminSession,adminController.salesReportMonthly)

router.get('/error',(req,res)=>{
    const currentPath=req.path
    res.render('./admin/error',{currentPath})
})


router.get('/logOut',adminController.adminLogOut)



module.exports=router