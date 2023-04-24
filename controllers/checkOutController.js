const cart = require("../modal/cart");
const product = require("../modal/products");
const mongoose = require("mongoose");
const address = require("../modal/address");
const coupon = require("../modal/coupon");
const users=require('../modal/users')

const checkOutController = {
  renderCheckout: async (req, res) => {
    try {
      const addressId = req.query.addressId;
      const session = req.session.user;
      let addressDetails;
      if (addressId) {
        addressDetails = await address.findOne(
          { userId: session },
          { addressDetails: { $elemMatch: { _id: addressId } } }
        );
      } else {
        addressDetails = await address.findOne({ userId: session });
      }
      const cartData = await cart
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(session) } },
          { $unwind: "$product" },
          {
            $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity",
            },
          },
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
              cartId: "$_id",
              _id: "$productDetails._id",
              name: "$productDetails.name",
              price: "$productDetails.price",
              size: "$productDetails.size",
              image: { $arrayElemAt: ["$productDetails.image.path", 0] },
              productDetails: { $arrayElemAt: ["$productDetails", 0] },
              quantity: "$productQuantity",
            },
          },
          {
            $addFields: {
              productPrice: {
                $multiply: ["$productQuantity", "$productDetails.price"],
              },
            },
          },
        ])
        .exec();
      const sum = cartData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);
      req.session.sum = sum;

      const logedIn=await users.findOne({_id:session})
      res.render("./users/checkout", {
        cartData,
        sum,
        logedIn,
        addressDetails,
      });
    } catch (err) {
      res.redirect('/error');
    }
  },
  verifyCoupon: async (req, res) => {
    try {
      const name = req.body.name;
      req.session.couponName = name
      const session = req.session.user;
      if (name) {
        const couponses = await coupon.find({ name: name });
        if (couponses.length > 0) {
          const coupons = couponses[0];
          if (coupons.delete === true) {
            res.json({ couponDelete: true });
          } else if (session) {
            const alredy = await coupon.find(
              { name: name },
              {
                users: {
                  $elemMatch: { userId: new mongoose.Types.ObjectId(session) },
                },
              }
            );
            if (alredy[0].users.length) {
              res.json({ alredy: true });
              return;
            } else if (new Date(coupons.date) < new Date()) {
              res.json({ couponExpired: true });
            } else if (coupons.minLimit > req.session.sum) {
              res.json({
                lessThan: true,
                minLimit: coupons.minLimit,
              });
            } else {
              let total;
              let dis = (req.session.sum * coupons.discount) / 100;
              if (dis > coupons.maxLimit) {
                total = req.session.sum - coupons.maxLimit;
              } else {
                total = req.session.sum - dis;
              }
              res.json({ status: true, total: total });
            }
          }
        } else {
          res.json({ couponExist: false });
        }
      } else {
        res.json({ null: true });
      }
    } catch (err) {
      res.redirect('/error');
    }
  },
  renderaddAddress: async (req, res) => {
    try {
      const session = req.session.user;
      const addresses = await address.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(session) } },
        { $unwind: "$addressDetails" },
        {
          $project: {
            fullName: "$addressDetails.fullName",
            title: "$addressDetails.title",
            houseName: "$addressDetails.houseName",
            city: "$addressDetails.city",
            district: "$addressDetails.district",
            state: "$addressDetails.state",
            pincode: "$addressDetails.pincode",
            phoneNumber: "$addressDetails.phoneNumber",
            _id: "$addressDetails._id",
          },
        },
      ]);
      
            const logedIn=await users.findOne({_id:session})
      const currentPath = req.path

      res.render("./users/addAddress", { logedIn, addresses,currentPath });
    } catch (err) {
      res.redirect('/error');
    }
  },
  firstAddress:async(req,res,next)=>{
    try{
      const session = req.session.user;
     
    }catch(err){
      res.redirect('/error')
    }
  },
  addAddress: async (req, res) => {
    try {
      const session = req.session.user;
      const addressObj = {
        state: req.body.state,
        district: req.body.district,
        city: req.body.city,
        pincode: req.body.pincode,
        fullName: req.body.fullname,
        phoneNumber: req.body.phoneNumber,
        houseName: req.body.houseName,
        title: req.body.title,
      };
      const addressExist = await address.findOne({ userId:new mongoose.Types.ObjectId(session)});
      if (addressExist) {
        await address.updateOne(
          { userId: session },
          { $push: { addressDetails: addressObj } }
        );
        res.redirect("/addAddress");
      } else {
        const newAddress = new address({
          userId: session,
          addressDetails: [
            {
              state: req.body.state,
              district: req.body.district,
              city: req.body.city,
              pincode: req.body.pincode,
              fullName: req.body.fullname,
              phoneNumber: req.body.phoneNumber,
              houseName: req.body.houseName,
              title: req.body.title,
            },
          ],
        });
        await newAddress.save().then(() => {
          res.redirect("/checkOut");
        });
      }
    } catch (err) {
      res.redirect('/error');
    }
  },
  editAddress: async (req, res) => {
    try {
      const session = req.session.user;
      const id = req.params.id;
      const addObj = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        state: req.body.state,
        district: req.body.district,
        city: req.body.city,
        pincode: req.body.pincode,
        houseName: req.body.houseName,
        title: req.body.title,
      };
      await address.findOneAndUpdate(
        { userId: session, "addressDetails._id": id },
        { $set: { "addressDetails.$": addObj } },
        { new: true }
      );
      res.redirect("/addAddress");
    } catch (err) {
      res.redirect('/error');
    }
  },
  removeAddress: async (req, res) => {
    try {
      const session=req.session.user
      const data = req.body;
      await address
        .updateOne(
          {
            userId: session,
            "addressDetails._id": data.addressId,
          },
          { $pull: { addressDetails: { _id: data.addressId } } }
        )
        .then(() => {
          res.json({ status: true });
        });
    } catch (err) {
      res.redirect('/error');
    }
  },
};

module.exports = checkOutController;
