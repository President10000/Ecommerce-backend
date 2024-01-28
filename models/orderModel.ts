import mongoose  from "mongoose"
// const {addressType} = require("./addressModel");
import {addressType} from "./addressModel"

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
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
      required:true,
      type: String,
      enum: [
        "COD",
        "RAZORPAY"
      ],
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
    address:addressType,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
export default mongoose.model("Order", orderSchema);
