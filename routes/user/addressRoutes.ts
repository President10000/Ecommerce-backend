import express from "express";
import {
  saveAddress,
  updateAddress,
  deleteAddress,
  // getAddressByUser,
  getAddressById
} from "../../controller/user/addressCtrl";
import { authMiddleware } from "../../middlewares/authMiddleware";
const router = express.Router();


router.get("/:id", authMiddleware, getAddressById);
// router.get("/by-user/:id", authMiddleware, getAddressByUser);
router.post("/", authMiddleware, saveAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
