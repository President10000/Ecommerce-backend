"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rating = exports.deleteProduct = exports.updateProduct = exports.getAllProduct = exports.getaProduct = exports.createProduct = exports.searchProducts = void 0;
// const Product = require("../models/productModel");
const productModel_1 = __importDefault(require("../models/productModel"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const slugify = require("slugify");
const slugify_1 = __importDefault(require("slugify"));
// const validateMongoDbId = require("../utils/validateMongodbId");
const validateMongodbId_1 = require("../utils/validateMongodbId");
const searchProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title: query_title, sort, fields, page, limit } = req.query;
    const { title: body_title } = req.body;
    const { title: param_title } = req.params;
    let title = query_title || param_title || body_title;
    try {
        // const queryObj = { ...req.query };
        // const excludeFields = ["page", "sort", "limit", "fields"];
        // excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = {}; // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // queryStr = JSON.parse(queryStr);
        queryStr.title = { $regex: new RegExp(title, "i") };
        // console.log({ queryStr, queryObj });
        let query = productModel_1.default.find(queryStr);
        // Sorting
        if (sort && typeof sort === "string") {
            const sortBy = sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort("-createdAt");
        }
        // limiting the fields
        if (fields && typeof fields === "string") {
            const field = fields.split(",").join(" ");
            query = query.select(field);
        }
        else {
            query = query.select("-__v");
        }
        // pagination
        // const page = req.query.page;
        // const limit = req.query.limit;
        if (page && limit) {
            const page_i = parseInt(page);
            const limit_i = parseInt(limit);
            if (typeof page_i === "number") {
                const skip = (page_i - 1) * limit_i;
                query = query.skip(skip).limit(limit_i);
                const productCount = yield productModel_1.default.countDocuments();
                if (skip >= productCount)
                    throw new Error("This Page does not exists");
            }
        }
        const product = yield query;
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.searchProducts = searchProducts;
const createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, price, category, quantity, as_draft } = req.body;
        if (!as_draft) {
            if ((!title || !price || !(category === null || category === void 0 ? void 0 : category.primary) || !quantity)) {
                throw new Error("title, price, category, quantity and primary category is required ");
            }
        }
        if (title) {
            req.body.slug = (0, slugify_1.default)(title);
            const newProduct = yield productModel_1.default.create(req.body);
            res.json(newProduct);
        }
        else {
            throw new Error("title is required");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.createProduct = createProduct;
const updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    const { title, price, category, quantity, as_draft } = req.body;
    // console.log(category)
    if (!as_draft) {
        if ((!title || !price || !(category === null || category === void 0 ? void 0 : category.primary) || !quantity)) {
            throw new Error("title, price, category, quantity and primary category is required ");
        }
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        if (title) {
            req.body.slug = (0, slugify_1.default)(req.body.title);
            const updateProduct = yield productModel_1.default.findOneAndUpdate({ _id: id }, req.body, {
                new: true,
            });
            // console.log(updateProduct)
            res.json(updateProduct);
        }
        else {
            throw new Error("title is required");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updateProduct = updateProduct;
const deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const deleteProduct = yield productModel_1.default.findOneAndDelete({ _id: id, as_draft: true });
        res.json(deleteProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.deleteProduct = deleteProduct;
const getaProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const findProduct = yield productModel_1.default.findById(id);
        res.json(findProduct);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getaProduct = getaProduct;
const getAllProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sort, fields, page, limit } = req.query;
    try {
        // Filtering
        const queryObj = Object.assign({}, req.query);
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        console.log({ queryStr, queryObj });
        let query = productModel_1.default.find(JSON.parse(queryStr));
        // Sorting
        if (sort && typeof sort === "string") {
            const sortBy = sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else {
            query = query.sort("-createdAt");
        }
        // limiting the fields
        if (fields && typeof fields === "string") {
            const field = fields.split(",").join(" ");
            query = query.select(field);
        }
        else {
            query = query.select("-__v");
        }
        // pagination
        if (page && limit) {
            const page_i = parseInt(page);
            const limit_i = parseInt(limit);
            if (typeof page_i === "number") {
                const skip = (page_i - 1) * limit_i;
                query = query.skip(skip).limit(limit_i);
                const productCount = yield productModel_1.default.countDocuments();
                if (skip >= productCount)
                    throw new Error("This Page does not exists");
            }
        }
        const product = yield query;
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getAllProduct = getAllProduct;
const rating = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
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
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.rating = rating;
