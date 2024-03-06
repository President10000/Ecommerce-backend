import express from "express";
import {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryById,
  // getEnquiryByUser,
  getallEnquiry,
} from "../controller/enqCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/", authMiddleware, createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiryById);
// router.get("/by-user/:id", getEnquiryByUser);
router.get("/", authMiddleware, isAdmin, getallEnquiry);

export default router;
