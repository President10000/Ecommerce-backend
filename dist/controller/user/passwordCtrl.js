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
exports.resetPassword = exports.forgotPasswordToken = exports.updatePassword = void 0;
// const User = require("../../models/userModel");
const userModel_1 = __importDefault(require("../../models/userModel"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
// const crypto = require("crypto");
const crypto_1 = __importDefault(require("crypto"));
// const sendEmail = require("../emailCtrl");
const emailCtrl_1 = __importDefault(require("../emailCtrl"));
const updatePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const _id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { password } = req.body;
    if (!_id)
        throw new Error("user not found something went wrong");
    (0, validateMongodbId_1.validateMongoDbId)(_id);
    const user = yield userModel_1.default.findById(_id);
    if (password && user) {
        user.password = password;
        const updatedPassword = yield user.save();
        res.json(updatedPassword);
    }
    else {
        res.json(user);
    }
}));
exports.updatePassword = updatePassword;
const forgotPasswordToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        throw new Error("User not found with this email");
    try {
        const token = yield user.createPasswordResetToken();
        yield user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        (0, emailCtrl_1.default)(data);
        res.json(token);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.forgotPasswordToken = forgotPasswordToken;
const resetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
        throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    res.json(user);
}));
exports.resetPassword = resetPassword;
