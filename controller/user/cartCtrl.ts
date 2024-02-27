import User from "../../models/userModel";
import Product from "../../models/productModel";
import Cart from "../../models/cartModel";
import Coupon from "../../models/couponModel";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";

import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../../utils/validateMongodbId";

const addItemToCart = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    const { product_id, quantity }: { product_id?: string; quantity?: number } =
      req.body;
    const _id = req.user?._id;
    let { populate = "" } = req.query;
    if (populate != "product" && populate != "user") populate = "";
    if (!product_id || !quantity || !_id) throw new Error("missing details");
    validateMongoDbId(_id);
    const isExist = await Cart.findOne({ product: product_id });
    if (isExist) {
      let updateQty = await Cart.findOneAndUpdate(
        { product: product_id, user: _id },
        { quantity: isExist.quantity + quantity },
        { new: true }
      ).populate({ path: populate, strictPopulate: false });

      res.json(updateQty);
    } else {
      let newCart = await (
        await new Cart({
          product: product_id,
          quantity,
          user: _id,
        }).save()
      ).populate({ path: populate, strictPopulate: false });

      res.json(newCart);
    }
  }
);

const getUserCart = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  let { populate = "" } = req.query;
  if (populate != "product" && populate != "user") populate = "";
  validateMongoDbId(_id);
  const cart = await Cart.find({ user: _id }).populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(cart);
});

const removeItemFromCart = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    const { toRemove }: { toRemove: string | string[] } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    if (typeof toRemove === "string") {
      const data = await Cart.deleteOne({
        $or: [{ _id: _id }, { product: _id }],
      });
      res.json(data);
    } else if (Array.isArray(toRemove)) {
      const data = await Cart.deleteMany({
        $or: [{ _id: { $in: toRemove } }, { product: { $in: toRemove } }],
      });
      res.json(data);
    } else {
      throw new Error("Invalid input type");
    }
  }
);

// todo
// const applyCoupon = asyncHandler(async (req: Req_with_user, res: Response) => {
//   if (!req.user) throw new Error("user not found");
//   const { _id } = req.user;
//   const { coupon } = req.body;
//   validateMongoDbId(_id);
//   const validCoupon = await Coupon.findOne({ name: coupon });
//   if (validCoupon === null) {
//     throw new Error("Invalid Coupon");
//   }
//   const user = await User.findOne({ _id });

//   res.json({});
// });

export { addItemToCart, removeItemFromCart, getUserCart, 
  // applyCoupon 
};
