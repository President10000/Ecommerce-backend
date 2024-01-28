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
exports.getallEnquiry = exports.getEnquiry = exports.deleteEnquiry = exports.updateEnquiry = exports.createEnquiry = void 0;
// const Enquiry = require("../models/enqModel");
const enqModel_1 = __importDefault(require("../models/enqModel"));
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../utils/validateMongodbId");
const validateMongodbId_1 = require("../utils/validateMongodbId");
const createEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEnquiry = yield enqModel_1.default.create(req.body);
        res.json(newEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.createEnquiry = createEnquiry;
const updateEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updatedEnquiry = yield enqModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updateEnquiry = updateEnquiry;
const deleteEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
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
const getEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: body_id } = req.body;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || query_id || body_id;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const getaEnquiry = yield enqModel_1.default.findById(id);
        res.json(getaEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getEnquiry = getEnquiry;
const getallEnquiry = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getallEnquiry = yield enqModel_1.default.find();
        res.json(getallEnquiry);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getallEnquiry = getallEnquiry;
