// const User = require("../../models/userModel");
import User from "../../models/userModel";
// const Product = require("../../models/productModel");
import Product from "../../models/productModel";
// const Cart = require("../../models/cartModel");
import Cart from "../../models/cartModel";
// const Coupon = require("../../models/couponModel");
import Coupon from "../../models/couponModel";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";

import asyncHandler from "express-async-handler";
// const validateMongoDbId = require("../../utils/validateMongodbId");
import { validateMongoDbId } from "../../utils/validateMongodbId";

// async function putItemToCart(existingCart, itemsToInsert) {
//   let cartTotal = 0;
//   for (let i = 0; i < itemsToInsert.length; i++) {
//     if (
//       existingCart.some(
//         (item) => item.product.toString() === itemsToInsert[i]._id
//       )
//     ) {
//       for (let item of existingCart) {
//         if (item.product.toString() === itemsToInsert[i]._id) {
//           item.count += itemsToInsert[i].count ? itemsToInsert[i].count : 1;
//         }
//       }
//     } else {
//       let object = {};
//       object.product = itemsToInsert[i]._id;
//       let getPrice = await Product.findById(itemsToInsert[i]._id)
//         .select("price")
//         .exec();
//       object.price = parseInt(getPrice.price);
//       object.count = itemsToInsert[i].count ? itemsToInsert[i].count : 1;
//       existingCart.push(object);
//     }
//   }
//   for (let i = 0; i < existingCart.length; i++) {
//     cartTotal = cartTotal + existingCart[i].price * existingCart[i].count;
//   }
//   return { products: existingCart, cartTotal };
// }

const addItemToCart = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    const { product, quantity }: { product?: string; quantity?: number } =
      req.body;
    const _id = req.user?._id;

    try {
      if (!product || !quantity || !_id) throw new Error("missing details");
      validateMongoDbId(_id);
      const isExist= await Cart.findOne({product})
      if(isExist){
        const updateQty= await Cart.findOneAndUpdate({product,user:_id},{quantity:isExist.quantity+quantity})
        res.json(updateQty);
      }else{
        
        let newCart = await new Cart({
          product,
          quantity,
          user: _id,
        }).save();
        res.json(newCart);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

const getUserCart = asyncHandler(async (req: Req_with_user, res: Response) => {
  if(!req.user)throw new Error("user not found")
  const {_id} = req.user;
  const { populate } = req.query;
  try {
    validateMongoDbId(_id);
    const cart = await Cart.find({ user: _id }).populate(
      populate as string | string[]
    );
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const removeItemFromCart = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if(!req.user)throw new Error("user not found")
    const { toRemove }: { toRemove: string | string[] } = req.body;
    const {_id} = req.user;
    const { populate } = req.query;
    try {
      validateMongoDbId(_id);
      if (typeof toRemove === "string") {
        const data = await Cart.deleteOne({ _id: toRemove }).populate(
          populate as string | string[]
        );
        res.json(data);
      } else if (Array.isArray(toRemove)) {
        const data = await Cart.deleteMany({ _id: { $in: toRemove } }).populate(
          populate as string | string[]
        );
        res.json(data);
      } else {
        throw new Error("Invalid input type");
      }

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);


// todo 
const applyCoupon = asyncHandler(async (req:Req_with_user, res:Response) => {
  if(!req.user)throw new Error("user not found")
  const {_id} = req.user;
  const { coupon } = req.body;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  // let { cartTotal } = await Cart.findOne({
  //   orderby: user._id,
  // }).populate("products.product");
  // let totalAfterDiscount = (
  //   cartTotal -
  //   (cartTotal * validCoupon.discount) / 100
  // ).toFixed(2);
  // await Cart.findOneAndUpdate(
  //   { orderby: user._id },
  //   { totalAfterDiscount },
  //   { new: true }
  // );
  res.json({});
});

export{
  addItemToCart,
  removeItemFromCart,
  getUserCart,
  applyCoupon,
};
