import express from "express";
const router = express.Router();
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
// const { searchProducts } = require("../controller/productCtrl");
import { searchProducts } from "../controller/productCtrl";

router.get("/product",  searchProducts);



export default router;