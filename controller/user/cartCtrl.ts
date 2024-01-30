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


const addItemToCart = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    const { product_id, quantity }: { product_id?: string; quantity?: number } =
      req.body;
    const _id = req.user?._id;

    try {
      if (!product_id || !quantity || !_id) throw new Error("missing details");
      validateMongoDbId(_id);
      const isExist = await Cart.findOne({ product: product_id });
      if (isExist) {
        const updateQty = await Cart.findOneAndUpdate(
          { product: product_id, user: _id },
          { quantity: isExist.quantity + quantity }
        );
        res.json(updateQty);
      } else {
        let newCart = await new Cart({
          product: product_id,
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
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
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
    if (!req.user) throw new Error("user not found");
    const { toRemove }: { toRemove: string | string[] } = req.body;
    const { _id } = req.user;
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
const applyCoupon = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
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

export { addItemToCart, removeItemFromCart, getUserCart, applyCoupon };
