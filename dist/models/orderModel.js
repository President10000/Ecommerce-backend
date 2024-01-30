"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const {addressType} = require("./addressModel");
// import { addressType } from "./addressModel";
// Declare the Schema of the Mongo model
const order = {
    products: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number,
        },
    ],
    paymentIntent: {},
    paymentMode: {
        required: true,
        type: String,
        enum: ["COD", "RAZORPAY"],
    },
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
        ],
    },
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Address",
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
};
var orderSchema = new mongoose_1.default.Schema(order, {
    timestamps: true,
});
//Export the model
exports.default = mongoose_1.default.model("Order", orderSchema);
