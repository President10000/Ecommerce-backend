"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressType = exports.Address = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
const addressType = {
    phone_no: String,
    country: String,
    first_name: String,
    last_name: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zipcode: String,
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
};
exports.addressType = addressType;
const addressSchema = new mongoose_1.default.Schema(addressType, {
    timestamps: true,
});
const Address = mongoose_1.default.model("Address", addressSchema);
exports.Address = Address;
