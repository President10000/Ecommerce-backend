const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  getDraftProducts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProductByCategory,
  deals_of_the_day,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);
router.get("/draft/products", getDraftProducts);
router.get("/category/:category", getProductByCategory);
router.get("/deals/deals_of_the_day", deals_of_the_day);

module.exports = router;
