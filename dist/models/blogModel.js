"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
var blogSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    dislikes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    author: {
        type: String,
        default: "Admin",
    },
    images: [],
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});
//Export the model
exports.default = mongoose_1.default.model("Blog", blogSchema);
