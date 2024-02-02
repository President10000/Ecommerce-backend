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
    let { populate = "" } = req.query;
    if (populate != "product" && populate != "user") populate = "";
    try {
      if (!product_id || !quantity || !_id) throw new Error("missing details");
      validateMongoDbId(_id);
      const isExist = await Cart.findOne({ product: product_id });
      if (isExist) {
        let updateQty = await Cart.findOneAndUpdate(
          { product: product_id, user: _id },
          { quantity: isExist.quantity + quantity },
          { new: true }
        );
        // updateQty = ;
        res.json(
          populate
            ? updateQty?.populate(populate as string | string[])
            : updateQty
        );
      } else {
        let newCart = await new Cart({
          product: product_id,
          quantity,
          user: _id,
        }).save();
        newCart = populate
          ? await newCart.populate(populate as string | string[])
          : newCart;
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
  let { populate = "" } = req.query;
  if (populate != "product" && populate != "user") populate = "";
  try {
    validateMongoDbId(_id);
    if (populate) {
      const cart = await Cart.find({ user: _id }).populate(
        populate as string | string[]
      );
      res.json(cart);
    } else {
      const cart = await Cart.find({ user: _id });
      res.json(cart);
    }
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
    // let { populate = "" } = req.query;
    // if (populate != "product" && populate != "user") populate = "";
    try {
      validateMongoDbId(_id);
      if (typeof toRemove === "string") {
        const data = await Cart.deleteOne({
          $or: [{ _id: _id }, { product: _id }],
        });
        // .populate(
        //   populate as string | string[]
        // );
        res.json(data);
      } else if (Array.isArray(toRemove)) {
        const data = await Cart.deleteMany({
          $or: [{ _id: { $in: toRemove } }, { product: { $in: toRemove } }],
        });
        // .populate(
        //   populate as string | string[]
        // );
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

  res.json({});
});

export { addItemToCart, removeItemFromCart, getUserCart, applyCoupon };
