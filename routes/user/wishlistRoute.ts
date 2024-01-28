// const express = require("express");
import express from "express"
import {
  getWishlistByUser,
  getWishById,
  createOrDeleteItem,
} from "../../controller/user/wishlistCtrl";
const router = express.Router();
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";

router.get("/by-user/:id", authMiddleware, getWishlistByUser);
router.get("/by-id/:id", authMiddleware, getWishById);
router.put("/:id", authMiddleware, createOrDeleteItem);

export default router;
