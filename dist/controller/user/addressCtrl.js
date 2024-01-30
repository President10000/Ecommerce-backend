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
exports.getAddressById = exports.getAddressByUser = exports.deleteAddress = exports.updateAddress = exports.saveAddress = void 0;
// const { Address } = require("../../models/addressModel");
const addressModel_1 = require("../../models/addressModel");
// const asyncHandler = require("express-async-handler");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// const validateMongoDbId = require("../../utils/validateMongodbId");
const validateMongodbId_1 = require("../../utils/validateMongodbId");
const saveAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { phone_no, zipcode } = req.body;
    if (!zipcode || !phone_no) {
        res.status(400).json({ message: `zipcode and phone no is required ` });
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(_id);
        let newAddress = yield new addressModel_1.Address(Object.assign(Object.assign({}, req.body), { user: _id })).save();
        res.json(newAddress);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.saveAddress = saveAddress;
const updateAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    // const { _id } = req.user;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    const { address } = req.body;
    const { phone_no, zipcode } = address;
    if (!zipcode || !phone_no) {
        res.status(400).json({ message: `zipcode and phone no is required ` });
    }
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updated = yield addressModel_1.Address.findOneAndUpdate({ _id: id }, address, {
            new: true,
        });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.updateAddress = updateAddress;
const deleteAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    // const { _id } = req.user;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updated = yield addressModel_1.Address.findByIdAndDelete(id);
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.deleteAddress = deleteAddress;
const getAddressByUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    const { _id } = req.user;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updated = yield addressModel_1.Address.find({ user: id });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getAddressByUser = getAddressByUser;
const getAddressById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new Error("user not found");
    // const { _id } = req.user;
    const { id } = req.params;
    // const { id: query_id } = req.query;
    try {
        (0, validateMongodbId_1.validateMongoDbId)(id);
        const updated = yield addressModel_1.Address.find({ _id: id });
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
}));
exports.getAddressById = getAddressById;
