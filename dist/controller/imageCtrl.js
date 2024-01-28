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
exports.deleteImages = exports.uploadImages = void 0;
// const fs = require("fs");
const fs_1 = __importDefault(require("fs"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const {
//   cloudinaryUploadImg,
//   cloudinaryDeleteImg,
// } = require("../utils/cloudinary");
const cloudinary_1 = require("../utils/cloudinary");
const uploadImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploader = (path) => (0, cloudinary_1.cloudinaryUploadImg)(path);
        const urls = [];
        if (req.files) {
            const files = req.files; //| { [fieldname: string]: Express.Multer.File[] };
            for (const file of files) {
                const { path } = file;
                const newpath = (yield uploader(path));
                console.log(newpath);
                urls.push(newpath);
                fs_1.default.unlinkSync(path);
            }
        }
        // const images = urls.map((file) => {
        //   return file;
        // });
        if (urls[0].asset_id) {
            res.json(urls);
        }
        else {
            res.status(500).send("Internal server error");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.uploadImages = uploadImages;
const deleteImages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { populate, id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    try {
        const deleted = yield (0, cloudinary_1.cloudinaryDeleteImg)(id);
        res.json(deleted);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.deleteImages = deleteImages;
