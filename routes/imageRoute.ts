import express from "express";
// const { uploadImages, deleteImages } = require("../controller/imageCtrl");
import { uploadImages,deleteImages } from "../controller/imageCtrl";
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
import { isAdmin,authMiddleware } from "../middlewares/authMiddleware";
// const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
import { uploadPhoto } from "../middlewares/uploadImage";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  // productImgResize,
  uploadImages
);

router.delete("/:id", authMiddleware, isAdmin, deleteImages);

export default router;
