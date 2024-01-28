"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// const { uploadImages, deleteImages } = require("../controller/imageCtrl");
const imageCtrl_1 = require("../controller/imageCtrl");
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const uploadImage_1 = require("../middlewares/uploadImage");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, uploadImage_1.uploadPhoto.array("images", 10), 
// productImgResize,
imageCtrl_1.uploadImages);
router.delete("/:id", authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, imageCtrl_1.deleteImages);
exports.default = router;
