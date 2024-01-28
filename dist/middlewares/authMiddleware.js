"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authMiddleware = void 0;
// const User = require("../models/userModel");
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        const secret = process.env.JWT_SECRET;
        try {
            if (token && secret) {
                const decoded = jsonwebtoken_1.default.verify(token, secret); //there could be some error 
                const user = yield userModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
                if (user) {
                    req.user = user;
                    next();
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Internal server error");
        }
    }
    else {
        res.status(404).json({ message: "Invalid Credentials" });
    }
}));
exports.authMiddleware = authMiddleware;
const isAdmin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const email = (_c = req.user) === null || _c === void 0 ? void 0 : _c.email;
    try {
        const adminUser = yield userModel_1.default.findOne({ email, role: "admin" });
        if (adminUser === null || adminUser === void 0 ? void 0 : adminUser._id) {
            next();
        }
        else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.isAdmin = isAdmin;
