const mongoose = require("mongoose");
const address = require("../modal/address");
const coupon = require("../modal/coupon");
const user = require("../modal/users");
const product = require("../modal/products");
const order = require("../modal/order");
const cart = require("../modal/cart");
const moment = require("moment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

require("dotenv").config();

const orderController = {
  placeOrder: async (req, res) => {
    try {
      const session = req.session.user;
      const cartData = await cart.findOne({ userId: session });
      const name = req.session.couponName;
      
      const orderData = new order({
        userId: session,
        name: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        orderItems: cartData.product,
        houseName: req.body.houseName,
        state: req.body.state,
        district: req.body.district,
        city: req.body.city,
        pincode: req.body.pincode,
        paymentMethod: req.body.paymentMethod,
        totalAmount: req.body.total,
        orderDate: moment().format("MMM Do YY"),
        deliveryDate: moment().add(4, "days").format("MMM Do YY"),
      });

      if (req.body.paymentMethod === "COD") {
        const orderDatas = await orderData.save();

        const orderId = orderDatas._id;
        await order.updateOne(
          { _id: orderId },
          { $set: { orderStatus: "placed" } }
        );
        await cart.deleteOne({ userId: session });
        if (name) {
          await coupon.updateOne(
            { name: name },
            { $push: { users: { userId: session } } }
          );
        }
        res.json({ success: true, orderId: orderId });
      } else {
        const orderDatas = await orderData.save();
        const orderId = orderDatas._id;
        let instance = new Razorpay({
          key_id: process.env.KEYID,
          key_secret: process.env.KEY_SECRET,
        });
        const amount = req.body.total * 100;
        let options = {
          amount: amount, // amount in the smallest currency unit
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(options, (err, order) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ order: order });
          }
        });
      }
    } catch (err) {
      res.redirect('/error');
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const session = req.session.user;
      const name = req.session.couponName;
      const details = req.body;
      let hmac = crypto.createHmac("SHA256", process.env.KEY_SECRET);
      hmac.update(
        details.payment.razorpay_order_id +
          "|" +
          details.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");

      if (hmac == details.payment.razorpay_signature) {
        const objId = new mongoose.Types.ObjectId(details.order.receipt);
        if (name) {
          await coupon.updateOne(
            { name: name },
            { $push: { users: { userId: session } } }
          );
        }

        await order.updateOne(
          { _id: objId },
          { $set: { paymentStatus: "paid", orderStatus: "placed" } }
        );
        cart
          .deleteOne({ userId: session })
          .then(() => {
            res.json({ success: true, orderId: objId });
          })
          .catch((err) => {
            console.log(err);
            res.json({ status: false, err_message: "payment failed" });
          });
      } else {
        console.log(err);
        res.json({ status: false, err_message: "payment failed" });
      }
    } catch (err) {
      res.redirect('/error');
    }
  },

  paymentFailed: async (req, res) => {
    try {
    } catch (err) {
      res.redirect('/error');
    }
  },
  renderOrderSuccess: async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const orderDetailed = await order.findOne({ _id: id });
      const orderData = await order.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$orderItems" },
        {
          $project: {
            productItem: "$orderItems.productId",
            productQuantity: "$orderItems.quantity",
            productSize: "$orderItems.size",
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
      ]);
      const sum = orderData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);

      let price;
      orderData.forEach((order) => {
        price = order.price;
      });
      const currentPath = req.path;
      const session=req.session.user
      const logedIn=await user.findOne({_id:session})
      res.render("./users/orderDetailed", {
        orderData,
        orderDetailed,
        price,
        sum,
        logedIn,
        currentPath,
      });
    } catch (err) {
      res.redirect('/error');
    }
  },
  renderOrders: async (req, res) => {
    try {
      const session = req.session.user;
      const orderData = await order
        .aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(session) } },
          { $unwind: "$orderItems" },
          {
            $project: {
              _id: 1,
              orderStatus: 1,
              paymentStatus: 1,
              productQuantity: 1,
              totalAmount: 1,
              productItem: "$orderItems.productId",
              productQuantity: "$orderItems.quantity",
              productSize: "$orderItems.size",
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
              _id: 1,
              orderStatus: 1,
              paymentStatus: 1,
              productQuantity: 1,
              totalAmount: 1,
              name: "$productDetails.name",
              price: "$productDetails.price",
              size: "$productDetails.size",
              image: { $arrayElemAt: ["$productDetails.image.path", 0] },
              productDetails: { $arrayElemAt: ["$productDetails", 0] },
              quantity: "$productQuantity",
            },
          },
        ])
        

      const logedIn = await user.findOne({ _id: session });
      res.render("./users/orders", { orderData, logedIn });
    } catch (err) {
      res.redirect('/error');
    }
  },
  cancelOrder:(req, res) => {
    try {
      const id = req.body.orderId;
      order.updateOne(
        { _id:new mongoose.Types.ObjectId(id)},
        { $set: { orderStatus: "Cancelled" } }
      ).then((updated)=>{
      res.json({ status: true });
      })
    } catch (err) {
      res.redirect('/error');
    }
  },
};

module.exports = orderController;
