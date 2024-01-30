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
exports.createOrDeleteItem = exports.getWishById = exports.getWishlistByUser = void 0;
// const User = require("../../models/userModel");
const userModel_1 = __importDefault(require("../../models/userModel"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
const wishlistModel_1 = __importDefault(require("../../models/wishlistModel"));
const createOrDeleteItem = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        // const user = await User.findById(_id);
        const alreadyadded = yield wishlistModel_1.default.findOne({
            user: _id,
            $or: [{ _id: id }, { product: id }],
        });
        if (alreadyadded) {
            let product = yield wishlistModel_1.default.deleteMany({ product: id });
            res.json({ status: "removed", wish: product });
        }
        else {
            const added = yield new wishlistModel_1.default({
                product: id,
                user: _id,
            }).save();
            res.json({ status: "added", wish: added });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.createOrDeleteItem = createOrDeleteItem;
const getWishlistByUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { id: param_id } = req.params;
    const { populate } = req.query;
    let id = _id || param_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const wishlist = yield wishlistModel_1.default
            .find({ user: id })
            .populate(populate);
        res.json(wishlist);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getWishlistByUser = getWishlistByUser;
const getWishById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    // const { _id } = req.user;
    const { id } = req.params;
    const { populate } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const wishlist = yield userModel_1.default.find({ _id: id }).populate(populate);
        res.json(wishlist);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getWishById = getWishById;
