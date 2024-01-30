"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const enqCtrl_1 = require("../controller/enqCtrl");
// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", enqCtrl_1.createEnquiry);
router.put("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, enqCtrl_1.updateEnquiry);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, enqCtrl_1.deleteEnquiry);
router.get("/by-id/:id", enqCtrl_1.getEnquiryById);
router.get("/by-user/:id", enqCtrl_1.getEnquiryByUser);
router.get("/", enqCtrl_1.getallEnquiry);
exports.default = router;
