const express = require("express");
const router = express.Router();
// const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { searchProducts } = require("../controller/productCtrl");

router.get("/search-product",  searchProducts);



module.exports = router;