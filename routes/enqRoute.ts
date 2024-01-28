// const express = require("express");
import express from "express"
import {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} from "../controller/enqCtrl";
// const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
import { authMiddleware,isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);

export default router;
