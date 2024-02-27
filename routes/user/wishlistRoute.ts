
import express from "express"
import {
  // getWishlistByUser,
  getWishById,
  createOrDeleteItem,
} from "../../controller/user/wishlistCtrl";
const router = express.Router();
import { authMiddleware } from "../../middlewares/authMiddleware";

// router.get("/by-user/:id", authMiddleware, getWishlistByUser);
router.get("/:id", authMiddleware, getWishById);
router.put("/:id", authMiddleware, createOrDeleteItem);

export default router;
