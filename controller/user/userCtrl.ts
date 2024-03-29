import User from "../../models/userModel";
import express, { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { generateToken } from "../../config/jwtToken";
import { validateMongoDbId } from "../../utils/validateMongodbId";
import { generateRefreshToken } from "../../config/refreshtoken";
import jwt from "jsonwebtoken";
import { Req_with_user } from "../../middlewares/authMiddleware";
import uniqid from "uniqid";
import { base_url } from "../../utils/axiosConfig";
import { transporter } from "../../utils/emaiTransporter";

// Create a User ----------------------------------------------

const usersToVerify: {
  date: number;
  _id: string;
  email: string;
  verificationToken: string;
}[] = [];

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email;

  if (!email) {
    throw new Error("Invalid Credentials");
  }

  const findUser = await User.findOne({ email: email });
  if (findUser) {
    throw new Error("User Already Exists");
  }
  if (!findUser) {
    const newUser = await new User(req.body).save();

    const verificationToken = uniqid();
    // Save user with verification token (in a real app, you'd save this to a database)
    usersToVerify.push({
      _id: newUser._id,
      email,
      verificationToken,
      date: Date.now(),
    });

    // Send verification email
    const mailOptions = {
      from: '"Hey 👻" <abc@gmail.com.com>',
      to: email,
      subject: "Email Verification",
      text: `Click the following link to verify your email: ${base_url}user/verify/email/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      mobile: newUser.mobile,
      token: generateToken(newUser._id.toString()),
    });
  }
});

const generateTokenToVerifyEmail = asyncHandler(
  async (req: Req_with_user, res: Response) => {
    if (!req.user) {
      throw new Error("user not found");
    }
    const { _id, email } = req.user;

    const verificationToken = uniqid();
    // Save user with verification token (in a real app, you'd save this to a database)
    usersToVerify.push({
      _id: _id,
      email,
      verificationToken,
      date: Date.now(),
    });

    // Send verification email
    const mailOptions = {
      from: '"Hey 👻" <abc@gmail.com.com>',
      to: email,
      subject: "Email Verification",
      text: `Click the following link to verify your email: ${base_url}user/verify/email/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      status: true,
      message: "sent to registered email",
    });
  }
);

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = usersToVerify.find((u) => u.verificationToken === token);
  if (!user) {
    res
      .status(404)
      .json({ succsess: false, message: "Invalid verification token" });
  } else {
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
    });

    console.log("Email verified for user:", user.email);
    res.json({
      succsess: true,
      message: "Email verified successfully",
    });
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string | undefined; password: string } =
    req.body;
  // check if user exists or not
  if (!email || !password) {
    throw new Error("crecidencials not found");
  }
  const findUser = await User.findOne({ email });
  if (!findUser || !(await findUser.isPasswordMatched(password)))
    throw new Error("Invalid Credentials");

  const refreshToken = await generateRefreshToken(findUser?._id.toString());
  await User.findByIdAndUpdate(
    findUser.id,
    {
      refreshToken: refreshToken,
    },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30 * 1000,
  });

  res.json({
    _id: findUser._id,
    firstname: findUser.firstname,
    lastname: findUser.lastname,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id.toString()),
  });
});

// admin login

const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // check if user exists or not
  if (!email || !password) {
    throw new Error("Invalid Credentials");
  }
  const findAdmin = await User.findOne({ email, role: "admin" });
  if (!findAdmin || !(await findAdmin.isPasswordMatched(password))) {
    throw new Error("Invalid Credentials");
  }
  const refreshToken = await generateRefreshToken(findAdmin?._id.toString());
  await User.findByIdAndUpdate(
    findAdmin._id,
    {
      refreshToken: refreshToken,
    },
    { new: true }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });
  res.json({
    _id: findAdmin?._id,
    firstname: findAdmin?.firstname,
    lastname: findAdmin?.lastname,
    email: findAdmin?.email,
    mobile: findAdmin?.mobile,
    token: generateToken(findAdmin?._id.toString()),
  });
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  const secret = process.env.JWT_SECRET;
  if (!user || !secret)
    throw new Error(" No Refresh token present in db or not matched");

  jwt.verify(refreshToken, secret, (err: any, decoded: any) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id.toString());
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req: Request, res: any) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
  // res.json({status:"done"})
});

// Update a user

// const updatedUser = asyncHandler(async (req: Req_with_user, res: Response) => {
//   if (!req.user) throw new Error("user not found");
//   const { _id } = req.user;
//   const { id } = req.body;
//   validateMongoDbId(id);
//   const updatedUser = await User.findByIdAndUpdate(
//     id,
//     {
//       firstname: req?.body?.firstname,
//       lastname: req?.body?.lastname,
//       email: req?.body?.email,
//       mobile: req?.body?.mobile,
//     },
//     {
//       new: true,
//     }
//   );
//   res.json(updatedUser);
// });

// Get all users

const getallUser = asyncHandler(async (req: Request, res: Response) => {
  const getUsers = await User.find();
    res.json(getUsers);
});

// Get a single user

const getaUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const user = await User.findById(id);
    res.json(user);
});

// Get a single user

const deleteaUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const deleteaUser = await User.findByIdAndDelete(id);
  res.json({
    deleteaUser,
  });
});

const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const blockusr = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  res.json(blockusr);
});

const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id);
  await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  res.json({
    message: "User UnBlocked",
  });
});

export {
  createUser,
  verifyEmail,
  generateTokenToVerifyEmail,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  // updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  loginAdmin,
};
