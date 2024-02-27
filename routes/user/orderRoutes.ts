
import express from "express";
import {
  payOnDeliveryOrder,payNowOrder,
  getOrdersByUser,
  updateOrderStatus,
  getAllOrders,
  getOrderById,
} from "../../controller/user/orderCtrl";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";
const router = express.Router();

router.post("/pay-on-delivery", authMiddleware, payOnDeliveryOrder);
router.post("/pay-now", authMiddleware, payNowOrder);
router.get("/by-user/:id", authMiddleware, getOrdersByUser);
router.get("/all", authMiddleware, isAdmin, getAllOrders);
router.get("/by-id/:id", authMiddleware, isAdmin, getOrderById);
router.put("/update/:id", authMiddleware,  updateOrderStatus);

export default router;
