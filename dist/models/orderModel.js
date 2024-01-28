"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const {addressType} = require("./addressModel");
const addressModel_1 = require("./addressModel");
// Declare the Schema of the Mongo model
var orderSchema = new mongoose_1.default.Schema({
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
        enum: [
            "COD",
            "RAZORPAY"
        ],
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
    address: addressModel_1.addressType,
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
//Export the model
exports.default = mongoose_1.default.model("Order", orderSchema);
