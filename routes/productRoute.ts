// const express = require("express");
import express from "express"
import  {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  // addToWishlist,
  rating,
} from "../controller/productCtrl";
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
import { isAdmin,authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);
// router.put("/wishlist", authMiddleware, addToWishlist);

router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

export default router;
