"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
var productReviewSchema = new mongoose_1.default.Schema({
    rating: {
        value: Number,
        date: {
            created: Date,
            updated: Date,
        },
    },
    comment: {
        value: String,
        date: {
            created: Date,
            updated: Date,
        },
    },
    images: [
        {
            public_id: String,
            asset_id: String,
            url: String,
            date: {
                created: Date,
                updated: Date,
            },
        },
    ],
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Product" },
    postedby: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
//Export the model
exports.default = mongoose_1.default.model("ProductReview", productReviewSchema);
