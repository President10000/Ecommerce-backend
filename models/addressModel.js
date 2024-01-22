const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema(
  {
    address: [{ label: String, value: String }],
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
