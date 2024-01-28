// const User = require("../../models/userModel");
import User from "../../models/userModel";

// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler"
// const validateMongoDbId = require("../../utils/validateMongodbId");
import { validateMongoDbId } from "../../utils/validateMongodbId";
// const crypto = require("crypto");
import crypto from "crypto"

// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"

// const sendEmail = require("../emailCtrl");
import sendEmail from "../emailCtrl";
import { Req_with_user } from "../../middlewares/authMiddleware";



const updatePassword = asyncHandler(async (req:Req_with_user, res) => {
    const _id  = req.user?._id;
    const { password } = req.body;
    if(!_id)throw new Error("user not found something went wrong")
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password && user) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  });
  
  const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email }:{email:string} = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      sendEmail(data);
      res.json(token);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });
  
  const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  });
  




export {
    updatePassword,
    forgotPasswordToken,
    resetPassword,
  };
  