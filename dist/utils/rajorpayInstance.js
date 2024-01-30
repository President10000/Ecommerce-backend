"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
exports.instance = new razorpay_1.default({
    key_id: "rzp_test_0VIkjqfMFMpUYa",
    key_secret: "JUfMDHke6OvgPF0AcnhzR6Sy",
});
