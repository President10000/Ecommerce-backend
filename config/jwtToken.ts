// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose";

const generateToken = (id:string) => {
const secret =process.env.JWT_SECRET
if(!secret){throw new Error("secret not found")}
  return jwt.sign({ id }, secret, { expiresIn: "1d" });
};

export { generateToken };
