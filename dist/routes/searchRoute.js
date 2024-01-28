"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
// const { searchProducts } = require("../controller/productCtrl");
const productCtrl_1 = require("../controller/productCtrl");
router.get("/product", productCtrl_1.searchProducts);
exports.default = router;
