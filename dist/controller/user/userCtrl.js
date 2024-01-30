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
exports.loginAdmin = exports.logout = exports.handleRefreshToken = exports.unblockUser = exports.blockUser = exports.updatedUser = exports.deleteaUser = exports.getaUser = exports.getallUser = exports.loginUserCtrl = exports.createUser = void 0;
// const User = require("../../models/userModel");
const userModel_1 = __importDefault(require("../../models/userModel"));
// const Product = require("../../models/productModel");
// const Cart = require("../../models/cartModel");
// const { Address } = require("../../models/addressModel");
// const Coupon = require("../../models/couponModel");
// const Order = require("../../models/orderModel");
// const uniqid = require("uniqid");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const { generateToken } = require("../../config/jwtToken");
const jwtToken_1 = require("../../config/jwtToken");
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
// const { generateRefreshToken } = require("../../config/refreshtoken");
const refreshtoken_1 = require("../../config/refreshtoken");
// const crypto = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const sendEmail = require("../emailCtrl");
// Create a User ----------------------------------------------
const createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * TODO:Get the email from req.body
     */
    const email = req.body.email;
    if (!email) {
        res.json(404).json({ message: "Invalid Credentials" });
    }
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = yield userModel_1.default.findOne({ email: email });
    if (!findUser) {
        /**
         * TODO:if user not found user create a new user
         */
        const newUser = yield userModel_1.default.create(req.body);
        res.json({
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email,
            mobile: newUser.mobile,
            token: (0, jwtToken_1.generateToken)(newUser._id.toString()),
        });
    }
    else {
        /**
         * TODO:if user found then thow an error: User already exists
         */
        // throw new Error("User Already Exists");
        res.status(400).json({ message: "User Already Exists" });
    }
}));
exports.createUser = createUser;
// Login a user
const loginUserCtrl = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check if user exists or not
    if (!email || !password) {
        throw new Error("crecidencials not found");
    }
    try {
        const findUser = yield userModel_1.default.findOne({ email });
        if (!findUser || !(yield findUser.isPasswordMatched(password)))
            throw new Error("Invalid Credentials");
        const refreshToken = yield (0, refreshtoken_1.generateRefreshToken)(findUser === null || findUser === void 0 ? void 0 : findUser._id.toString());
        const updateuser = yield userModel_1.default.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
        });
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: (0, jwtToken_1.generateToken)(findUser._id.toString()),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.loginUserCtrl = loginUserCtrl;
// admin login
const loginAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check if user exists or not
    if (!email || !password) {
        throw new Error("Invalid Credentials");
    }
    const findAdmin = yield userModel_1.default.findOne({ email, role: "admin" });
    if (!findAdmin || !(yield findAdmin.isPasswordMatched(password))) {
        throw new Error("Invalid Credentials");
    }
    try {
        const refreshToken = yield (0, refreshtoken_1.generateRefreshToken)(findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin._id.toString());
        yield userModel_1.default.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken,
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30,
        });
        res.json({
            _id: findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin._id,
            firstname: findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.firstname,
            lastname: findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.lastname,
            email: findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.email,
            mobile: findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin.mobile,
            token: (0, jwtToken_1.generateToken)(findAdmin === null || findAdmin === void 0 ? void 0 : findAdmin._id.toString()),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.loginAdmin = loginAdmin;
// handle refresh token
const handleRefreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken))
        throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = yield userModel_1.default.findOne({ refreshToken });
    const secret = process.env.JWT_SECRET;
    if (!user || !secret)
        throw new Error(" No Refresh token present in db or not matched");
    jsonwebtoken_1.default.verify(refreshToken, secret, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = (0, jwtToken_1.generateToken)(user === null || user === void 0 ? void 0 : user._id.toString());
        res.json({ accessToken });
    });
}));
exports.handleRefreshToken = handleRefreshToken;
// logout functionality
const logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken))
        throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = yield userModel_1.default.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    yield userModel_1.default.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
    // res.json({status:"done"})
}));
exports.logout = logout;
// Update a user
const updatedUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { id: body_id } = req.body;
    // const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = _id || query_id || body_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, {
            firstname: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.firstname,
            lastname: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.lastname,
            email: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.email,
            mobile: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.mobile,
        }, {
            new: true,
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updatedUser = updatedUser;
// Get all users
const getallUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield userModel_1.default.find().populate("wishlist");
        res.json(getUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getallUser = getallUser;
// Get a single user
const getaUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id: body_id } = req.body;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const user = yield userModel_1.default.findById(id);
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getaUser = getaUser;
// Get a single user
const deleteaUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id: body_id } = req.body;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const deleteaUser = yield userModel_1.default.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.deleteaUser = deleteaUser;
const blockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id: body_id } = req.body;
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const blockusr = yield userModel_1.default.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true,
        });
        res.json(blockusr);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.blockUser = blockUser;
const unblockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id: body_id } = req.body;
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        yield userModel_1.default.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        });
        res.json({
            message: "User UnBlocked",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.unblockUser = unblockUser;
