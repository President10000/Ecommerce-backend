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
exports.getOrderById = exports.getAllOrders = exports.updateOrderStatus = exports.getOrdersByUser = exports.payNowOrder = exports.payOnDeliveryOrder = void 0;
// const Product = require("../../models/productModel");
const productModel_1 = __importDefault(require("../../models/productModel"));
// const Cart = require("../../models/cartModel");
const cartModel_1 = __importDefault(require("../../models/cartModel"));
// const Order = require("../../models/orderModel");
const orderModel_1 = __importDefault(require("../../models/orderModel"));
// const uniqid = require("uniqid");
const uniqid_1 = __importDefault(require("uniqid"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
const rajorpayInstance_1 = require("../../utils/rajorpayInstance");
const payOnDeliveryOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receipt, notes, address, couponApplied } = req.body;
    const _id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    if (!address || !receipt || !notes || !_id) {
        throw new Error("Create cash order failed");
    }
    // else {
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        // const user = await User.findById(_id);
        let userCart = yield cartModel_1.default.find({ user: _id });
        const ids = userCart === null || userCart === void 0 ? void 0 : userCart.map((item) => item.product);
        let finalAmout = 0;
        const productsToOrder = yield productModel_1.default.find({ _id: { $in: ids } }, "quantity price");
        //## checking ordering quantity is available in stock or not
        for (const itemToOrder of userCart) {
            const stock = productsToOrder.find((item) => { var _a; return item._id.toString() === ((_a = itemToOrder === null || itemToOrder === void 0 ? void 0 : itemToOrder.product) === null || _a === void 0 ? void 0 : _a.toString()); });
            if (!stock || !stock.quantity || !stock.price || !(itemToOrder === null || itemToOrder === void 0 ? void 0 : itemToOrder.quantity)) {
                throw new Error("quantity not found");
            }
            if (itemToOrder.quantity > (stock === null || stock === void 0 ? void 0 : stock.quantity)) {
                // res.status(400).json({ message: "product already sold out" });
                throw new Error("product already sold out");
            }
            finalAmout = finalAmout + stock.price * 100 * itemToOrder.quantity;
        }
        let newOrder = yield new orderModel_1.default({
            products: userCart,
            address,
            paymentMode: "COD",
            paymentIntent: {
                id: (0, uniqid_1.default)(),
                amount: finalAmout,
                amount_paid: 0,
                amount_due: finalAmout,
                status: "created",
                method: "COD",
                created_at: Date.now(),
                currency: "INR",
                notes,
                receipt,
            },
            user: _id,
            orderStatus: "Processing",
        }).save();
        let update = userCart.map((item) => {
            if (!item.quantity)
                throw new Error("something went wrong quantity undefind ");
            return {
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
                },
            };
        });
        yield productModel_1.default.bulkWrite(update, {});
        res.json(yield newOrder.populate(populate));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.payOnDeliveryOrder = payOnDeliveryOrder;
const payNowOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { receipt, notes, address, couponApplied } = req.body;
    const _id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    if (!address || !receipt || !notes || !_id) {
        throw new Error("Create cash order failed");
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        let userCart = yield cartModel_1.default.find({ user: _id });
        const ids = userCart === null || userCart === void 0 ? void 0 : userCart.map((item) => item.product);
        let finalAmout = 0;
        const productsToOrder = yield productModel_1.default.find({ _id: { $in: ids } }, "quantity price");
        //## checking ordering quantity is available in stock or not
        for (const itemToOrder of userCart) {
            const stock = productsToOrder.find((item) => { var _a; return item._id.toString() === ((_a = itemToOrder === null || itemToOrder === void 0 ? void 0 : itemToOrder.product) === null || _a === void 0 ? void 0 : _a.toString()); });
            if (!stock || !stock.quantity || !stock.price || !(itemToOrder === null || itemToOrder === void 0 ? void 0 : itemToOrder.quantity)) {
                throw new Error("quantity not found");
            }
            if (itemToOrder.quantity > (stock === null || stock === void 0 ? void 0 : stock.quantity)) {
                res.status(400).json({ message: "product already sold out" });
                throw new Error("product already sold out");
            }
            finalAmout = finalAmout + stock.price * 100 * itemToOrder.quantity;
        }
        const paymentIntent = yield rajorpayInstance_1.instance.orders.create({
            amount: finalAmout,
            currency: "INR",
            receipt,
            notes,
        });
        const newOrder = yield new orderModel_1.default({
            products: userCart,
            paymentIntent: Object.assign(Object.assign({}, paymentIntent), { amount_paid: 0, amount_due: finalAmout, status: "created", method: "COD", created_at: Date.now() }),
            paymentMode: "RAZORPAY",
            address,
            user: _id,
            orderStatus: "Processing",
        }).save();
        let update = userCart.map((item) => {
            if (!item.quantity)
                throw new Error("something went wrong quantity undefind ");
            return {
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
                },
            };
        });
        yield productModel_1.default.bulkWrite(update, {});
        res.json(yield newOrder.populate(populate));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.payNowOrder = payNowOrder;
const getOrdersByUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    let { _id } = req.user;
    const { id: param_id } = req.params;
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    _id = _id || param_id; //|| (query_id as string);
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        const userorders = yield orderModel_1.default.find({ user: _id })
            .populate(populate)
            .exec();
        res.json(userorders);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getOrdersByUser = getOrdersByUser;
const getAllOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    try {
        const alluserorders = yield orderModel_1.default.find().populate(populate); //.exec();
        res.json(alluserorders);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getAllOrders = getAllOrders;
const getOrderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const userorders = yield orderModel_1.default.find({ _id: id }).populate(populate); //.exec();
        res.json(userorders);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getOrderById = getOrderById;
const updateOrderStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.params;
    let { populate = "" } = req.query;
    if (populate != "products.product" &&
        populate != "user" &&
        populate != "address") {
        populate = "";
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updateOrderStatus = yield orderModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate(populate);
        res.json(updateOrderStatus);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updateOrderStatus = updateOrderStatus;
