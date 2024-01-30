// const Product = require("../models/productModel");
import Product from "../models/productModel";
// const User = require("../models/userModel");
import User from "../models/userModel";
// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";
// const slugify = require("slugify");
import slugify from "slugify";

// const validateMongoDbId = require("../utils/validateMongodbId");
import { validateMongoDbId } from "../utils/validateMongodbId";
import { Request, Response } from "express";
import { Req_with_user } from "../middlewares/authMiddleware";

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  let { title: query_title, sort, fields, page, limit } = req.query;
  const { title: body_title }: { title: string } = req.body;
  const { title: param_title } = req.params;
  let title = (query_title as string) || param_title || body_title;
  try {
    // const queryObj = { ...req.query };
    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr: { title?: { $regex: RegExp } } = {}; // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // queryStr = JSON.parse(queryStr);

    queryStr.title = { $regex: new RegExp(title, "i") };
    // console.log({ queryStr, queryObj });
    let query = Product.find(queryStr);

    // Sorting

    if (sort && typeof sort === "string") {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (fields && typeof fields === "string") {
      const field = fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // pagination

    // const page = req.query.page;
    // const limit = req.query.limit;
    if (page && limit) {
      const page_i = parseInt(page as string);
      const limit_i = parseInt(limit as string);
      if (typeof page_i === "number") {
        const skip = (page_i - 1) * limit_i;
        query = query.skip(skip).limit(limit_i);
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
      }
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const createProduct = asyncHandler(async (req:Request, res:Response) => {
  try {
    const { title, price, category, quantity, as_draft } = req.body;
    if (!as_draft) {
      if ((!title|| !price|| !category?.primary|| !quantity)) {
        throw new Error(
          "title, price, category, quantity and primary category is required "
        );
      }
    }
    if (title) {
      req.body.slug = slugify(title);
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } else {
      throw new Error("title is required");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const updateProduct = asyncHandler(async (req:Request, res:Response) => {
  const { id: body_id }:{id:string} = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id as string || body_id;
  const { title, price, category, quantity, as_draft } = req.body;
  // console.log(category)
  if (!as_draft) {
    if ((!title|| !price|| !category?.primary|| !quantity)) {
      throw new Error(
        "title, price, category, quantity and primary category is required "
      );
    }
  }
  try {
    validateMongoDbId(id);
    if (title) {
      req.body.slug = slugify(req.body.title);
      const updateProduct = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        {
          new: true,
        }
      );
      // console.log(updateProduct)
      res.json(updateProduct);
    } else {
      throw new Error("title is required");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id: body_id }:{id:string} = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id as string || body_id;
  try {
    validateMongoDbId(id);
    const deleteProduct = await Product.findOneAndDelete({_id:id,as_draft:true});
    res.json(deleteProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id: body_id }:{id:string} = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id as string || body_id;
  try {
    validateMongoDbId(id);
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  let {  sort, fields, page, limit } = req.query;
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log({ queryStr, queryObj });
    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (sort&& typeof sort === "string") {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (fields && typeof fields === "string") {
      const field = fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // pagination

    if (page && limit) {
      const page_i = parseInt(page as string);
      const limit_i = parseInt(limit as string);
      if (typeof page_i === "number") {
        const skip = (page_i - 1) * limit_i;
        query = query.skip(skip).limit(limit_i);
        const productCount = await Product.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
      }
    }

    
    const product = await query;
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// const addToWishlist = asyncHandler(async (req, res) => {
//   const { _id } = req.user;

//   const { prodId } = req.body;
//   try {
//     validateMongoDbId(prodId);
//     const user = await User.findById(_id);
//     const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

//     if (alreadyadded) {
//       let wishlist = await User.findByIdAndUpdate(
//         _id,
//         {
//           $pull: { wishlist: prodId },
//         },
//         {
//           new: true,
//           projection: "wishlist",
//         }
//       );
//       res.json({ status: "removed", wishlist });
//     } else {
//       let wishlist = await User.findByIdAndUpdate(
//         _id,
//         {
//           $push: { wishlist: prodId },
//         },
//         {
//           new: true,
//           projection: "wishlist",
//         }
//       );
//       res.json({ status: "added", wishlist });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

const rating = asyncHandler(async (req:Req_with_user, res:Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  // const { star, prodId, comment } = req.body;
  try {
    res.json({status:"todo"})
    // const product = await Product.findById(prodId);
    // let alreadyRated = product.ratings.find(
    //   (userId) => userId.postedby.toString() === _id.toString()
    // );
    // if (alreadyRated) {
    //   const updateRating = await Product.updateOne(
    //     {
    //       ratings: { $elemMatch: alreadyRated },
    //     },
    //     {
    //       $set: { "ratings.$.star": star, "ratings.$.comment": comment },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    // } else {
    //   const rateProduct = await Product.findByIdAndUpdate(
    //     prodId,
    //     {
    //       $push: {
    //         ratings: {
    //           star: star,
    //           comment: comment,
    //           postedby: _id,
    //         },
    //       },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    // }
    // const getallratings = await Product.findById(prodId);
    // let totalRating = getallratings.ratings.length;
    // let ratingsum = getallratings.ratings
    //   .map((item) => item.star)
    //   .reduce((prev, curr) => prev + curr, 0);
    // let actualRating = Math.round(ratingsum / totalRating);
    // let finalproduct = await Product.findByIdAndUpdate(
    //   prodId,
    //   {
    //     totalrating: actualRating,
    //   },
    //   { new: true }
    // );
    // const product = await Product.findById(prodId);
    // let alreadyRated = product.ratings.find(
    //   (userId) => userId.postedby.toString() === _id.toString()
    // );
    // if (alreadyRated) {
    //   const updateRating = await Product.updateOne(
    //     {
    //       ratings: { $elemMatch: alreadyRated },
    //     },
    //     {
    //       $set: { "ratings.$.star": star, "ratings.$.comment": comment },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    // } else {
    //   const rateProduct = await Product.findByIdAndUpdate(
    //     prodId,
    //     {
    //       $push: {
    //         ratings: {
    //           star: star,
    //           comment: comment,
    //           postedby: _id,
    //         },
    //       },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    // }
    // const getallratings = await Product.findById(prodId);
    // let totalRating = getallratings.ratings.length;
    // let ratingsum = getallratings.ratings
    //   .map((item) => item.star)
    //   .reduce((prev, curr) => prev + curr, 0);
    // let actualRating = Math.round(ratingsum / totalRating);
    // let finalproduct = await Product.findByIdAndUpdate(
    //   prodId,
    //   {
    //     totalrating: actualRating,
    //   },
    //   { new: true }
    // );
    // res.json(finalproduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export{
  searchProducts,
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  // addToWishlist,
  rating,
};
