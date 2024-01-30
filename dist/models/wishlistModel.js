"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
const wishlist = {
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
};
const wishlistSchema = new mongoose_1.default.Schema(wishlist, {
    timestamps: true,
});
//Export the model
exports.default = mongoose_1.default.model("wishlist", wishlistSchema);
