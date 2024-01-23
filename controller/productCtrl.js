const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { title, price, category, quantity, as_draft } = req.body;
    if (!as_draft) {
      if ((!title, !price, !category?.primary, !quantity)) {
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
    res.status(400).json({ message: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  if (validateMongoDbId(id)) {
    const { title, price, category, quantity, as_draft } = req.body;
    // console.log(category)
    if (!as_draft) {
      if ((!title, !price, !category?.primary, !quantity)) {
        throw new Error(
          "title, price, category, quantity and primary category is required "
        );
      }
    }
    try {
      if (title) {
        req.body.slug = slugify(req.body.title);
        const updateProduct = await Product.findOneAndUpdate(
          { _id: id.id },
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
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(400).json({ message: "invalid id" });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    res.status(400).json(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    res.status(400).json(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
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

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    res.status(400).json(error);
  }
});



const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { prodId } = req.body;
  validateMongoDbId(prodId);
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyadded) {
      let wishlist = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,projection: 'wishlist'
        }
      );
      res.json({status:"removed",wishlist});
    } else {
      let wishlist = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,projection: 'wishlist'
        }
      );
      res.json({status:"added",wishlist});
    }
  } catch (error) {
    res.status(400).json({message:error.message});
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
