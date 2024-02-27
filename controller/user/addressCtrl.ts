import { Address } from "../../models/addressModel";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { Req_with_user } from "../../middlewares/authMiddleware";
import { Response } from "express";

const saveAddress = asyncHandler(async (req: Req_with_user, res: Response) => {
  if (!req.user) throw new Error("user not found");
  const { _id } = req.user;
  let { populate = "" } = req.query;
  if (populate != "user") populate = "";
  const { phone_no, zipcode } = req.body;
  if (!zipcode || !phone_no) {
    res.status(400).json({ message: `zipcode and phone no is required ` });
  }

  validateMongoDbId(_id);
  let newAddress = await (
    await new Address({ ...req.body, user: _id }).save()
  ).populate({ path: populate, strictPopulate: false });
  res.json(newAddress);
});

const updateAddress = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    const { id } = req.params;
    let { populate = "" } = req.query;
    if (populate != "user") populate = "";
    const { address } = req.body;
    const { phone_no, zipcode } = address;

    if (!zipcode || !phone_no) {
      res.status(400).json({ message: `zipcode and phone no is required ` });
    }

    validateMongoDbId(id);
    const updated = await Address.findOneAndUpdate({ _id: id }, address, {
      new: true,
    }).populate({ path: populate, strictPopulate: false });
    res.json(updated);
  }
);

const deleteAddress = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    const { id } = req.params;

    validateMongoDbId(id);
    const updated = await Address.findByIdAndDelete(id);
    res.json(updated);
  }
);

// const getAddressByUser = asyncHandler(async (req: Req_with_user, res) => {
//   if (!req.user) throw new Error("user not found");
//   let { populate = "" } = req.query;
//   if (populate != "user") populate = "";
//   const { _id } = req.user;
//   let { id } = req.params;
//   id = _id || id;
//   try {
//     validateMongoDbId(id);
//     if (populate) {
//       const updated = await Address.find({ user: id }).populate(
//         populate as string | string[]
//       );
//       res.json(updated);
//     } else {
//       const updated = await Address.find({ user: id });
//       res.json(updated);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

const getAddressById = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) throw new Error("user not found");
    // const { _id } = req.user;
    const { id } = req.params;
    let { populate = "" } = req.query;
    if (populate != "user") populate = "";

    validateMongoDbId(id);
    const updated = await Address.find({
      $or: [{ _id: id }, { user: id }],
    }).populate({ path: populate, strictPopulate: false });
    res.json(updated);
  }
);

export {
  saveAddress,
  updateAddress,
  deleteAddress,
  // getAddressByUser,
  getAddressById,
};
