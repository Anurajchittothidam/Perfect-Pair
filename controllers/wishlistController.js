const wishlist = require("../modal/wishlist");
// const ObjectId = require('mongoose').Types.ObjectId;
const user = require("../modal/users");

const wishlistController = {
  viewWishlist: async (req, res) => {
    try {
      let countInWishList;
      const session = req.session.user;
      const userData = await user.findOne({ _id: session });
      const userId = userData._id;
      const wishlistData = await wishlist.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "products",
            localField: "product.productId",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            wishlistId: "$_id",
            _id: "$productDetail._id",
            name: "$productDetail.name",
            price: "$productDetail.price",
            size: "$productDetail.size",
            image: { $arrayElemAt: ["$productDetail.image.path", 0] },
          },
        },
      ]);
      countInWishList = wishlistData.length;

      const logedIn = await user.findOne({ _id: session });
      res.render("./users/wishlist", {
        logedIn,
        wishlistData,
        countInWishList,
      });
    } catch (err) {
      res.redirect('/error')
    }
  },
  addToWishList: async (req, res) => {
    try {
      const id = req.params.id;
      const ObjId = id;
      if (req.session.user) {
        const session = req.session.user;
        let proObj = {
          productId: ObjId,
        };
        const userWishlist = await wishlist.findOne({ userId: session });
        if (userWishlist) {
          let proExist = userWishlist.product.findIndex(
            (product) => product.productId == id
          );
          if (proExist != -1) {
            res.json({ productExist: true });
          } else {
            wishlist
              .updateOne(
                {
                  userId: session,
                },
                { $push: { product: proObj } }
              )
              .then(() => {
                res.json({ status: true });
              });
          }
        } else {
          const newWishlist = new wishlist({
            userId: session,
            product: [
              {
                productId: ObjId,
              },
            ],
          });
          newWishlist.save().then(() => {
            res.json({ status: true });
          });
        }
      } else {
        res.json({ redirectUrl: "/login" });
      }
    } catch (err) {
      res.redirect('/error')
    }
  },

  removeFromWishList: async (req, res) => {
    try {
      const data = req.body;
      const ObjId = data.productId;
      await wishlist.aggregate([{ $unwind: "$product" }]);
      await wishlist
        .updateOne(
          {
            _id: data.wishlistId,
            "product.productId": ObjId,
          },
          { $pull: { product: { productId: ObjId } } }
        )
        .then(() => {
          res.json({ status: true });
        });
    } catch (err) {
      res.redirect('/error')
    }
  },
};

module.exports = wishlistController;
