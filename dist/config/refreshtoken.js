"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateRefreshToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("secret not found");
    }
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: "3d" });
};
exports.generateRefreshToken = generateRefreshToken;
