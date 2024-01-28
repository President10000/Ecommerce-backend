import mongoose  from "mongoose";

// Declare the Schema of the Mongo model

const wishlist = {
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

const wishlistSchema = new mongoose.Schema(wishlist, {
  timestamps: true,
});

//Export the model
export default mongoose.model("wishlist", wishlistSchema);
