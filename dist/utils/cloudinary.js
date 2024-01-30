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
exports.cloudinaryDeleteImg = exports.cloudinaryUploadImg = void 0;
// const cloudinary = require("cloudinary");
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const cloudinaryUploadImg = (fileToUploads) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.upload(fileToUploads, { resource_type: "auto" }, (result) => {
            resolve({
                url: result === null || result === void 0 ? void 0 : result.secure_url,
                asset_id: result === null || result === void 0 ? void 0 : result.asset_id,
                public_id: result === null || result === void 0 ? void 0 : result.public_id,
            });
        });
    });
});
exports.cloudinaryUploadImg = cloudinaryUploadImg;
const cloudinaryDeleteImg = (public_id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        cloudinary_1.default.v2.uploader.destroy(public_id, (result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            });
        });
    });
});
exports.cloudinaryDeleteImg = cloudinaryDeleteImg;
