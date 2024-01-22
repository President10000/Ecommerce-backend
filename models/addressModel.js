const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema(
  {
    phone_no: String,
    country: String,
    first_name: String,
    last_name: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zipcode: String,
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
module.exports = mongoose.model("Address", addressSchema);
