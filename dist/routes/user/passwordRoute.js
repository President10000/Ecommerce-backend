"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const passwordCtrl_1 = require("../../controller/user/passwordCtrl");
const router = express_1.default.Router();
// const { authMiddleware } = require("../../middlewares/authMiddleware");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
router.post("/forgot-token", passwordCtrl_1.forgotPasswordToken);
router.put("/reset/:token", passwordCtrl_1.resetPassword);
router.put("/update", authMiddleware_1.authMiddleware, passwordCtrl_1.updatePassword);
exports.default = router;
