
import express from "express";
import {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  // updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  loginAdmin,
  verifyEmail,
  generateTokenToVerifyEmail,
} from "../../controller/user/userCtrl";
import passwordRoute from "./passwordRoute"
import cartRoutes from "./cartRoutes"
import orderRoutes from "./orderRoutes"
import addressRoutes from "./addressRoutes"
import wishlistRoute from "./wishlistRoute"
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", createUser);
router.get("/verify/email/:token", verifyEmail);
router.post("/verify/email",authMiddleware, generateTokenToVerifyEmail);

router.get("/refresh", handleRefreshToken);

router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/logout", logout);

router.use("/password", passwordRoute);

router.use("/cart", cartRoutes);

router.use("/order", orderRoutes);

router.use("/wishlist", wishlistRoute);

router.use("/address", addressRoutes);

// router.put("/edit", authMiddleware, updatedUser);

router.get("/find/:id", authMiddleware, isAdmin, getaUser);
router.get("/find", authMiddleware, isAdmin, getallUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);
router.delete("/delete/:id", authMiddleware, isAdmin, deleteaUser);

export default router;
