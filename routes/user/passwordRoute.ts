
import express from "express";
import {
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../../controller/user/passwordCtrl";
const router = express.Router();
import { authMiddleware } from "../../middlewares/authMiddleware";

router.post("/generate-reset-token", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/update", authMiddleware, updatePassword);

export default router;
