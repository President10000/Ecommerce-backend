"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const orderCtrl_1 = require("../../controller/user/orderCtrl");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/pay-on-delivery", authMiddleware_1.authMiddleware, orderCtrl_1.payOnDeliveryOrder);
router.post("/pay-now", authMiddleware_1.authMiddleware, orderCtrl_1.payNowOrder);
router.get("/by-user/:id", authMiddleware_1.authMiddleware, orderCtrl_1.getOrdersByUser);
router.get("/all", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, orderCtrl_1.getAllOrders);
router.get("/by-id/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, orderCtrl_1.getOrderById);
router.put("/update/:id", authMiddleware_1.authMiddleware, orderCtrl_1.updateOrderStatus);
exports.default = router;
