"use strict";
// const multer = require("multer");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPhoto = void 0;
// const sharp = require("sharp");
// import sharp from "sharp"
// const path = require("path");
const path_1 = __importDefault(require("path"));
// const fs = require("fs");
const fs_1 = __importDefault(require("fs"));
// const os = require("os");
const os_1 = __importDefault(require("os"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const dir = path_1.default.join(os_1.default.tmpdir(), "images");
        fs_1.default.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const uploadPhoto = (0, multer_1.default)({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
});
exports.uploadPhoto = uploadPhoto;
