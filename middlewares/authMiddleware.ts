// const User = require("../models/userModel");
import User, { user } from "../models/userModel";
import jwt from "jsonwebtoken";
// const asyncHandler = require("express-async-handler");
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
      try {
        if (token && secret) {
          const decoded = jwt.verify(token, secret) as any;  //there could be some error 
          const user = await User.findById(decoded?.id);
          if (user) {
            req.user = user;
            next();
          }
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    } else {
      res.status(404).json({ message: "Invalid Credentials" });
    }
  }
);
const isAdmin = asyncHandler(async (req:Req_with_user, res, next) => {
  const email = req.user?.email;
  try {
    const adminUser = await User.findOne({ email, role: "admin" });
    if (adminUser?._id) {
      next();
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
export { authMiddleware, isAdmin };
