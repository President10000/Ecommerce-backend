// const mongoose = require("mongoose"); // Erase if already required
import { Model, Schema, model } from "mongoose";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
import crypto from "crypto";
// const crypto = require("crypto");
// Declare the Schema of the Mongo model

interface Methods {
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
}
export interface user {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  isEmailVerified: boolean;
  mobile: string;
  isMobileNumberVerified: boolean;
  password: string;
  role: "user" | "admin";
  isBlocked: boolean;
  refreshToken: string;
  passwordChangedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}
type UserModel = Model<user, {}, Methods>;
// const user=
var userSchema = new Schema<user, UserModel, Methods>(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastname: {
      type: String,
      required: true,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: Boolean,
    mobile: {
      type: String,
      required: true,
      unique: true,
      maxLength: 10,
      minLength: 10,
    },
    isMobileNumberVerified: Boolean,
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 100,
    },

    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
); //as UserSchema;

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// userSchema
userSchema.methods.isPasswordMatched = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resettoken;
};

//Export the model
export default model("User", userSchema);
