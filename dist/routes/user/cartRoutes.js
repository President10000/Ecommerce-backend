"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartCtrl_1 = require("../../controller/user/cartCtrl");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, cartCtrl_1.addItemToCart);
router.delete("/", authMiddleware_1.authMiddleware, cartCtrl_1.removeItemFromCart);
router.post("/applycoupon", authMiddleware_1.authMiddleware, cartCtrl_1.applyCoupon);
router.get("/", authMiddleware_1.authMiddleware, cartCtrl_1.getUserCart);
// router.delete("/empty-cart", authMiddleware, emptyCart);
exports.default = router;
