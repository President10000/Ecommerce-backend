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
exports.getallEnquiry = exports.getEnquiryByUser = exports.getEnquiryById = exports.deleteEnquiry = exports.updateEnquiry = exports.createEnquiry = void 0;
// const Enquiry = require("../models/enqModel");
const enqModel_1 = __importDefault(require("../models/enqModel"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../utils/validateMongodbId");
const validateMongodbId_1 = require("../utils/validateMongodbId");
const createEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "user")
        populate = "";
    try {
        const newEnquiry = yield new enqModel_1.default(req.body).save();
        res.json(yield newEnquiry.populate(populate));
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.createEnquiry = createEnquiry;
const updateEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "user")
        populate = "";
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updatedEnquiry = yield enqModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        }).populate(populate);
        res.json(updatedEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updateEnquiry = updateEnquiry;
const deleteEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const deletedEnquiry = yield enqModel_1.default.findByIdAndDelete(id);
        res.json(deletedEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.deleteEnquiry = deleteEnquiry;
const getEnquiryById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "user")
        populate = "";
    const { id } = req.params;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const getaEnquiry = yield enqModel_1.default.findById(id).populate(populate);
        res.json(getaEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getEnquiryById = getEnquiryById;
const getEnquiryByUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "user")
        populate = "";
    if (!req.user)
        throw new Error("user not found");
    let { id } = req.params;
    id = id || req.user._id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const getaEnquiry = yield enqModel_1.default.find({ user: id }).populate(populate);
        res.json(getaEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getEnquiryByUser = getEnquiryByUser;
const getallEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { populate = "" } = req.query;
    if (populate != "user")
        populate = "";
    try {
        const getallEnquiry = yield enqModel_1.default.find().populate(populate);
        res.json(getallEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getallEnquiry = getallEnquiry;
