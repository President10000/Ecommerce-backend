import Product from "../models/productModel";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { validateMongoDbId } from "../utils/validateMongodbId";
import { Request, Response } from "express";
import { Req_with_user } from "../middlewares/authMiddleware";

const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  let { title, sort, fields, page, limit } = req.query;
  if (typeof title !== "string") throw new Error("title should be string");
  // const queryObj = { ...req.query };
  // const excludeFields = ["page", "sort", "limit", "fields"];
  // excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr: { title?: { $regex: RegExp } } = {}; // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // queryStr = JSON.parse(queryStr);

  queryStr.title = { $regex: new RegExp(title, "i") };
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
});

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { title, price, category, quantity, as_draft } = req.body;
  if (!as_draft) {
    if (!title || !price || !category?.primary || !quantity) {
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
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, price, category, quantity, as_draft } = req.body;
  if (!as_draft) {
    if (!title || !price || !category?.primary || !quantity) {
      throw new Error(
        "title, price, category, quantity and primary category is required "
      );
    }
  }
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
    res.json(updateProduct);
  } else {
    throw new Error("title is required");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleteProduct = await Product.findOneAndDelete({
    _id: id,
    as_draft: true,
  });
  res.json(deleteProduct);
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const findProduct = await Product.findById(id);
  res.json(findProduct);
});

const getAllProduct = asyncHandler(async (req, res) => {
  let { sort, fields, page, limit } = req.query;
  // Filtering
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log({ queryStr, queryObj });
  let query = Product.find(JSON.parse(queryStr));

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
});

const rating = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  // const { star, prodId, comment } = req.body;
  try {
    res.json({ status: "todo" });
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

export {
  searchProducts,
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  // addToWishlist,
  rating,
};
