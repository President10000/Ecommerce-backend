import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  getUserCart,
  applyCoupon,
} from "../../controller/user/cartCtrl";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, addItemToCart);
router.delete("/", authMiddleware, removeItemFromCart);
router.post("/applycoupon", authMiddleware, applyCoupon);
router.get("/", authMiddleware, getUserCart);
// router.delete("/empty-cart", authMiddleware, emptyCart);

export default  router;
