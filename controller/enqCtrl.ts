import Enquiry from "../models/enqModel";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongodbId";

const createEnquiry = asyncHandler(async (req, res) => {
  let { populate = "" } = req.query;
  if (populate != "user") populate = "";
  const newEnquiry = await (
    await new Enquiry(req.body).save()
  ).populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(newEnquiry);
});

const updateEnquiry = asyncHandler(async (req, res) => {
  let { populate = "" } = req.query;
  if (populate != "user") populate = "";
  const { id } = req.params;
  validateMongoDbId(id);
  const updated = await Enquiry.findByIdAndUpdate(id, req.body, {
    new: true,
  }).populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(updated);
});
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
  res.json(deletedEnquiry);
});

const getEnquiryById = asyncHandler(async (req, res) => {
  let { populate = "" } = req.query;
  if (populate != "user") populate = "";
  const { id } = req.params;
  validateMongoDbId(id);
  const getaEnquiry = await Enquiry.find({ $or:[{user: id},{_id:id} ]}).populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(getaEnquiry);
});
// const getEnquiryByUser = asyncHandler(async (req: Req_with_user, res) => {
//   let { populate = "" } = req.query;
//   if (populate != "user") populate = "";
//   if (!req.user) throw new Error("user not found");
//   let { id } = req.params;
//   id = id || req.user._id;
//   validateMongoDbId(id);
//   const getaEnquiry = await Enquiry.find({ user: id }).populate({
//     path: populate,
//     strictPopulate: false,
//   });
//   res.json(getaEnquiry);
// });
const getallEnquiry = asyncHandler(async (req, res) => {
  let { populate = "" } = req.query;
  if (populate != "user") populate = "";
  const getallEnquiry = await Enquiry.find().populate({
    path: populate,
    strictPopulate: false,
  });
  res.json(getallEnquiry);
});
export {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryById,
  // getEnquiryByUser,
  getallEnquiry,
};
