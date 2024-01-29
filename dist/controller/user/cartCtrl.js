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
exports.applyCoupon = exports.getUserCart = exports.removeItemFromCart = exports.addItemToCart = void 0;
// const User = require("../../models/userModel");
const userModel_1 = __importDefault(require("../../models/userModel"));
// const Cart = require("../../models/cartModel");
const cartModel_1 = __importDefault(require("../../models/cartModel"));
// const Coupon = require("../../models/couponModel");
const couponModel_1 = __importDefault(require("../../models/couponModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
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
const addItemToCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { product, quantity } = req.body;
    const _id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        if (!product || !quantity || !_id)
            throw new Error("missing details");
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        const isExist = yield cartModel_1.default.findOne({ product });
        if (isExist) {
            const updateQty = yield cartModel_1.default.findOneAndUpdate({ product, user: _id }, { quantity: isExist.quantity + quantity });
            res.json(updateQty);
        }
        else {
            let newCart = yield new cartModel_1.default({
                product,
                quantity,
                user: _id,
            }).save();
            res.json(newCart);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.addItemToCart = addItemToCart;
const getUserCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { populate } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        const cart = yield cartModel_1.default.find({ user: _id }).populate(populate);
        res.json(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getUserCart = getUserCart;
const removeItemFromCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { toRemove } = req.body;
    const { _id } = req.user;
    const { populate } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        if (typeof toRemove === "string") {
            const data = yield cartModel_1.default.deleteOne({ _id: toRemove }).populate(populate);
            res.json(data);
        }
        else if (Array.isArray(toRemove)) {
            const data = yield cartModel_1.default.deleteMany({ _id: { $in: toRemove } }).populate(populate);
            res.json(data);
        }
        else {
            throw new Error("Invalid input type");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.removeItemFromCart = removeItemFromCart;
// todo 
const applyCoupon = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { coupon } = req.body;
    (0, validateMongodbId_1.validateMongoDbId)(_id);
    const validCoupon = yield couponModel_1.default.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = yield userModel_1.default.findOne({ _id });
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
}));
exports.applyCoupon = applyCoupon;
