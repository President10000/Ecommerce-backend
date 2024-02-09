// const express = require("express");
import express, { Request, Response } from "express";
import {
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../../controller/user/passwordCtrl";
const router = express.Router();
// const { authMiddleware } = require("../../middlewares/authMiddleware");
import { authMiddleware } from "../../middlewares/authMiddleware";

router.post("/generate-reset-token", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/update", authMiddleware, updatePassword);

export default router;
