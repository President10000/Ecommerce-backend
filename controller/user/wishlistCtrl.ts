import User from "../../models/userModel";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";
import wishlistModel from "../../models/wishlistModel";
import { strict_false } from "../../utils/populate";

const createOrDeleteItem = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    const { _id } = req.user;
    let { populate = "" } = req.query;

    const { id } = req.params;
    validateMongoDbId(id);
    const alreadyadded = await wishlistModel.findOne({
      user: _id,
      $or: [{ _id: id }, { product: id }],
    });
    if (alreadyadded) {
      let product = await wishlistModel.deleteMany({ product: id });
      res.json({ status: "removed", wish: product });
    } else {
      const added = await (
        await new wishlistModel({
          product: id,
          user: _id,
        }).save()
      ).populate(strict_false(populate));
      res.json({
        status: "added",
        wish: added,
      });
    }
  }
);

// const getWishlistByUser = asyncHandler(
//   async (req: Req_with_user, res: Response) => {
//     if (!req.user) throw new Error("user not found");
//     const { _id } = req.user;
//     const { id: param_id } = req.params;
//     let { populate = "" } = req.query;
//     if (populate != "product" && populate != "user") populate = "";

//     let id = _id || param_id;
//     validateMongoDbId(id);
//     const wishlist = await wishlistModel
//       .find({ user: id })
//       .populate({ path: populate, strictPopulate: false });
//     res.json(wishlist);
//   }
// );
const getWishById = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { id } = req.params;
  let { populate = "" } = req.query;
  validateMongoDbId(id);
  const wishlist = await User.find({
    $or: [{ _id: id }, { user: id }],
  }).populate(strict_false(populate));
  res.json(wishlist);
});

export {
  //  getWishlistByUser,
  getWishById,
  createOrDeleteItem,
};
