// const { Address } = require("../../models/addressModel");
import { Address } from "../../models/addressModel";

// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";
// const validateMongoDbId = require("../../utils/validateMongodbId");
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";

const saveAddress = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  const { phone_no, zipcode } = req.body;
  if (!zipcode || !phone_no) {
    res.status(400).json({ message: `zipcode and phone no is required ` });
  }

  try {
    validateMongoDbId(_id);
    let newAddress = await new Address({ ...req.body, user: _id }).save();
    res.json(newAddress);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const updateAddress = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    // const { _id } = req.user;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || (query_id as string);
    const { address } = req.body;
    const { phone_no, zipcode } = address;

    if (!zipcode || !phone_no) {
      res.status(400).json({ message: `zipcode and phone no is required ` });
    }

    try {
      validateMongoDbId(id);
      const updated = await Address.findOneAndUpdate({ _id: id }, address, {
        new: true,
      });
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

const deleteAddress = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    // const { _id } = req.user;
    const { id: param_id } = req.params;
    const { id: query_id } = req.query;
    let id = param_id || (query_id as string);

    try {
      validateMongoDbId(id);
      const updated = await Address.findByIdAndDelete(id);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

const getAddressByUser = asyncHandler(async (req: Req_with_user, res) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id =_id|| param_id || (query_id as string);
  try {
    validateMongoDbId(id);
    const updated = await Address.find({ user: id });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getAddressById = asyncHandler(async (req:Req_with_user, res:Response) => {
  if (!req.user) throw new Error("user not found");
  // const { _id } = req.user;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || (query_id as string);

  try {
    validateMongoDbId(id);
    const updated = await Address.find({ _id: id });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export {
  saveAddress,
  updateAddress,
  deleteAddress,
  getAddressByUser,
  getAddressById,
};
