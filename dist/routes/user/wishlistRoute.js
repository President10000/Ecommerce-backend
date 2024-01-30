"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const wishlistCtrl_1 = require("../../controller/user/wishlistCtrl");
const router = express_1.default.Router();
const authMiddleware_1 = require("../../middlewares/authMiddleware");
router.get("/by-user/:id", authMiddleware_1.authMiddleware, wishlistCtrl_1.getWishlistByUser);
router.get("/by-id/:id", authMiddleware_1.authMiddleware, wishlistCtrl_1.getWishById);
router.put("/:id", authMiddleware_1.authMiddleware, wishlistCtrl_1.createOrDeleteItem);
exports.default = router;
