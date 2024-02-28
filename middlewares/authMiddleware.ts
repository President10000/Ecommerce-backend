
import User, { user } from "../models/userModel";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import  { NextFunction, Request, Response } from "express";

export interface Req_with_user extends Request {
  user?: user;
}

const authMiddleware = asyncHandler(
  async (req: Req_with_user, res: Response, next: NextFunction) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET;
      if (token && secret) {
        const decoded = jwt.verify(token, secret) as any;  //there could be some error 
        const user = await User.findById(decoded?.id);
        if (user) {
          req.user = user;
          next();
        }
      }
    } else {
      throw new Error('Invalid Credentials')
    }
  }
);
const isAdmin = asyncHandler(async (req:Req_with_user, res, next) => {
  const email = req.user?.email;
  const adminUser = await User.findOne({ email, role: "admin" });
  if (adminUser?._id) {
    next();
  } else {
    throw new Error('Invalid Credentials')
  }
});
export { authMiddleware, isAdmin };
