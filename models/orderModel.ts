import mongoose from "mongoose";
// const {addressType} = require("./addressModel");
// import { addressType } from "./addressModel";

// Declare the Schema of the Mongo model

const order = {
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
  paymentIntent: {},

  paymentMode: {
    required: true,
    type: String,
    enum: ["COD", "RAZORPAY"],
  },
  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Delivered",
    ],
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

var orderSchema = new mongoose.Schema(order, {
  timestamps: true,
});

//Export the model
export default mongoose.model("Order", orderSchema);
