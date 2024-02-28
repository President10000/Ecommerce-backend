
import User from "../../models/userModel";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../../utils/validateMongodbId";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Req_with_user } from "../../middlewares/authMiddleware";
import {
  base_url,
  front_end_route_to_reset_password,
} from "../../utils/axiosConfig";
import { transporter } from "../../utils/emaiTransporter";
import { generateToken } from "../../config/jwtToken";

const updatePassword = asyncHandler(async (req: Req_with_user, res) => {
  const _id = req.user?._id;
  const { password } = req.body;
  if (!_id) throw new Error("user not found ");
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password && user) {
    user.password = password;
    const updated = await user.save();
    res.json({
      status: true,
      user: {
        _id: updated._id,
        firstname: updated.firstname,
        lastname: updated.lastname,
        email: updated.email,
        mobile: updated.mobile,
        token: generateToken(updated._id.toString()),
      },
    });
  } else {
   throw new Error("user or password not found")
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email }: { email: string } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. ${front_end_route_to_reset_password}?token=${token}`;
    const mailOptions = {
      from: '"Hey 👻" <abc@gmail.com.com>',
      to: email,
      subject: "Reset Your Password",
      text: resetURL,
    };
    await transporter.sendMail(mailOptions);
    res.json(token);
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

export { updatePassword, forgotPassword, resetPassword };
