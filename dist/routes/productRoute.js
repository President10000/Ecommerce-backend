"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const productCtrl_1 = require("../controller/productCtrl");
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, productCtrl_1.createProduct);
router.get("/:id", productCtrl_1.getaProduct);
// router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware_1.authMiddleware, productCtrl_1.rating);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, productCtrl_1.updateProduct);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, productCtrl_1.deleteProduct);
router.get("/", productCtrl_1.getAllProduct);
exports.default = router;
