"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
var couponSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
});
//Export the model
exports.default = mongoose_1.default.model("Coupon", couponSchema);
