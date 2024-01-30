"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressCtrl_1 = require("../../controller/user/addressCtrl");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/by-id/:id", authMiddleware_1.authMiddleware, addressCtrl_1.getAddressById);
router.get("/by-user/:id", authMiddleware_1.authMiddleware, addressCtrl_1.getAddressByUser);
router.post("/", authMiddleware_1.authMiddleware, addressCtrl_1.saveAddress);
router.put("/:id", authMiddleware_1.authMiddleware, addressCtrl_1.updateAddress);
router.delete("/:id", authMiddleware_1.authMiddleware, addressCtrl_1.deleteAddress);
exports.default = router;
