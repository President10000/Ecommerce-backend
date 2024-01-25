const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var productReviewSchema = new mongoose.Schema(
  {
    rating: {
      value: Number,
      date: {
        created: Date,
        updated: Date,
      },
    },
    comment: {
      value: String,
      date: {
        created: Date,
        updated: Date,
      },
    },
    images: [
      {
        public_id: String,
        asset_id: String,
        url: String,
        date: {
          created: Date,
          updated: Date,
        },
      },
    ],
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("ProductReview", productReviewSchema);
