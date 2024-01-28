// const Enquiry = require("../models/enqModel");
import Enquiry from "../models/enqModel";
// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";
// const validateMongoDbId = require("../utils/validateMongodbId");
import { validateMongoDbId } from "../utils/validateMongodbId";

const createEnquiry = asyncHandler(async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { id: body_id } = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id || body_id;
  try {
    validateMongoDbId(id);
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id: body_id } = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id || body_id;
  try {
    validateMongoDbId(id);
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

const getEnquiry = asyncHandler(async (req, res) => {
  const { id: body_id } = req.body;
  const { id: param_id } = req.params;
  const { id: query_id } = req.query;
  let id = param_id || query_id || body_id;
  try {
    validateMongoDbId(id);
    const getaEnquiry = await Enquiry.findById(id);
    res.json(getaEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
const getallEnquiry = asyncHandler(async (req, res) => {
  try {
    const getallEnquiry = await Enquiry.find();
    res.json(getallEnquiry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
export {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
};
