"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
const dbConnect = () => {
    const db = process.env.MONGODB_URI;
    if (!db) {
        throw new Error("data base not found");
    }
    try {
        mongoose_1.default.connect(db);
        console.log("Database Connected Successfully");
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = dbConnect;
